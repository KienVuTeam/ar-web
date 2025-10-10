const mongoose = require("mongoose");
const XLSX = require('xlsx');
const AthleteEntity = require("../model/Athlete");
const mapAthleteForExcel = require('../utils/mapAthleteForExcel')
const athleteService = require("./athlete.service");
const SNAME ="AthleteServiceV1 ";

class AthleteV1 extends athleteService {
  #mess; //provate field
  constructor() {
    super()// goi constructor cua class cha
    // this.#mess = mess //private
    // this.name = name //public
  }
  // get mess(){
  //     return this.#mess;
  // }
  // set mess(val){
  //     this.#mess = val;
  // }
  //-----------------------------
  //lay cac thong tin stats ra
  //count sum documnet
  async sumAthlete(event_id) {
    return await AthleteEntity.countDocuments({ event_id });
  }
  //tong so da checkin / chua checkin
  async countCheckin(event_id) {
    return await AthleteEntity.countDocuments({ event_id, checkin: true });
  }
  async countNoCheckin(event_id) {
    return await AthleteEntity.countDocuments({ event_id, checkin: false });
  }
  //gioi tinh
  async genderStats(event_id) {
    return await AthleteEntity.aggregate([
      { $match: { event_id: new mongoose.Types.ObjectId(event_id) } },
      {
        $group: {
          _id: "$gender",
          total: { $sum: 1 },
        },
      },
    ]);
    // => [{ _id: true, total: 11 }, { _id: false, total: 9 }]
  }
  //   distance
  async statsDistance(event_id) {
    return await AthleteEntity.aggregate([
      { $match: { event_id: new mongoose.Types.ObjectId(event_id) } },
      {
        $group: {
          _id: {
            distance: "$distance",
            gender: "$gender",
            checkin: "$checkin",
          },
          total: { $sum: 1 },
        },
      },
    ]);
  }
//   { $cond: [<điều_kiện>, <giá_trị_nếu_true>, <giá_trị_nếu_false>] }
  //get onece
  async statsSummary(event_id) {
    const summary = await AthleteEntity.aggregate([
      { $match: { event_id: new mongoose.Types.ObjectId(event_id) } },
    {
      $facet: {
        // Tổng quan
        overview: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              checkedIn: { $sum: { $cond: ["$checkin", 1, 0] } },
              notCheckedIn: { $sum: { $cond: ["$checkin", 0, 1] } },
              male: { $sum: { $cond: ["$gender", 1, 0] } },
              female: { $sum: { $cond: ["$gender", 0, 1] } },
              // ví dụ thêm: uỷ quyền, miễn trừ nếu có field
              uyQuyen: { $sum: { $cond: [{ $eq: ["$registry", "ủy quyền"] }, 1, 0] } },
              mienTru: { $sum: { $cond: [{ $eq: ["$registry", "miễn trừ"] }, 1, 0] } },
            },
          },
        ],

        // Nhóm theo cự ly
        byDistance: [
          {
            $group: {
              _id: "$distance",
              total: { $sum: 1 },
              male: { $sum: { $cond: ["$gender", 1, 0] } },
              female: { $sum: { $cond: ["$gender", 0, 1] } },
              checkedIn: { $sum: { $cond: ["$checkin", 1, 0] } },
              notCheckedIn: { $sum: { $cond: ["$checkin", 0, 1] } },
            },
          },
          { $sort: { _id: 1 } }
        ],
      },
    },
    ]);
    return summary[0];
  }
  async athleteImportOnce(event_id, data){
    try {
      console.log('run2')
      const doc = new AthleteEntity({
        bib: data.bib,
        name: data.name,
        event_id:new mongoose.Types.ObjectId(event_id),
        bib_name: data.bibName,
        gender: data.gender === "true", // convert string -> boolean
        email: data.email,
        phone: data.phone,
        dob: data.dob ? new Date(data.dob) : null, // convert string -> Date
        cccd: data.cccd,
        nation: data.nation,
        team: data.team,
        chip: data.chip,
        epc: data.epc,
        distance: data.distance,
        patron_name: data.patronName,
        patron_phone: data.patronPhone,
        medical: data.medical,
        blood: data.blood,
        size: data.size
      });
      await doc.save();
      return true;
    } catch (error) {
      console.log(SNAME+ error);
      return false;
    }
  }
  //api athlete control
  async athleteControl({event_id="" ,page = 1, limit =10, search ="", sort="bib:asc"}){
    // console.log('trong service')
    console.log(event_id,page, limit, search)
    const query ={ 
      event_id: new mongoose.Types.ObjectId(event_id)
    };
    if (search) {
      query.$or=[
        {name: {$regex: search, $options: 'i'} }, //tim theo ten
        {cccd: {$regex: search, $options: 'i'}},
        {bib: {$regex: search, $options: 'i'}},
        {email: {$regex: search, $options: 'i'}},
        {phone: {$regex: search, $options: 'i'}},
      ]

    }
    const [sortField, sortOrder] = sort.split(':');
    const sortObj ={};
    // sortObj={};
    sortObj[sortField] =sortOrder==="asc" ?1:-1;

    const total  = await AthleteEntity.countDocuments(query).lean();
    const data = await AthleteEntity.find(query)
    .sort(sortObj)
    .skip((page-1)*limit)
    .limit(Number(limit)).lean();

    return{
      data,
      pagination:{
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total/limit)
      }
    }
  }
  //api export -> .xlsx
  async athleteExportExcel(event_id){
    try {
      //lay nguon data tu mongoDB
      const result = await AthleteEntity.find({event_id: event_id}).lean();
      if(result){
        //2chuan bi data du lieu cho excel 
        const mappedData = result.map((row) => {
                return mapAthleteForExcel(row); 
              });
              // const data = 
        // const data =  mapAthleteForExcel(result)
      //3.tao workbook va sheet
      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Athletes');
      //4. Xuat ra buffer de controller gui ve client
      const buffer = XLSX.write(workbook, {type: 'buffer', bookType: 'xlsx'});
      return {success: true, buffer}
      }
      return {success: false}
    } catch (error) {
      console.log(SNAME+ error);
      return {success: false}
    }
  }
  
 
}

module.exports = AthleteV1;
