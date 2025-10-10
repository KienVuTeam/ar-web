const xlsx = require("xlsx");
const mongoose = require("mongoose");

const eventService = require("../../../services/event.service");
const EventService = require("../../../services/event.service");
const AthleteEntity = require("../../../model/Athlete");
const AthleteV1Service = require("../../../services/AthleteV1.service");
const { search } = require("../../../router/testRoute");
const CNAME = "EventProcessingController: ";
const VNAME = "admin/eventprocessing/";
const VLAYOUT = "layout/layoutAdmin";

//function helper
function normalizeGender(val) {
  if (!val) return null;
  const v = val.toString().trim().toLowerCase();
  if (["m", "male", "nam"].includes(v)) return true;
  if (["f", "female", "nữ", "nu"].includes(v)) return false;
  return null;
}
// mail
function validateEmail(mail) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}
//parser excel date
function parseExcelDate(value) {
  if (!value) return null;

  // 1. Nếu là số -> Excel serial
  if (typeof value === "number") {
    const excelEpoch = new Date(1900, 0, 1);
    const days = Math.floor(value) - 1;
    const date = new Date(excelEpoch.getTime() + days * 86400000);

    // fix bug leap year 1900
    if (value > 59) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  }

  // 2. Nếu là string
  if (typeof value === "string") {
    // Thử parse dạng ISO (yyyy-mm-dd) hoặc dạng JS hiểu được
    let parts;

    // dd/mm/yyyy
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      parts = value.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS month 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }

    // yyyy-mm-dd hoặc format mà Date hiểu được
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d;
    }

    return null; // không parse được
  }

  return null;
}
//map data
function mapRowByIndex(row, eventId, rowNumber, errors) {
  let athlete = {
    event_id: eventId,
    bib: String(row[0] || ""), // BIB
    chip: String(row[1] || ""), // CHIPCODE
    epc: row[2] || "", // EPC
    bib_name: row[3] || "", // Tên trên BIB
    size: row[4] || "", //size ao
    distance: row[5] || "", // cu ly
    name: row[6] || "", // Họ tên
    gender: normalizeGender(row[7]), //gender
    dob: parseExcelDate(row[8]), //ngay sinh [vi]
    phone: row[9] || "", //sdt
    email: row[10].trim().toLowerCase() || "", //email
    cccd: row[11] || "", //cccd
    nationality: row[12], //quoc tich
    nation: row[13] || "", //Quoc gia
    city: row[14] || "", //tinh /tp
    address: row[15] || "", //dia chi
    patron_name: row[16] || "", //ten nguoi lien he
    patron_phone: String(row[17] || ""), //sdt nguoi lien he
    medical: row[18] || "", //thong tin y te,
    blood: row[19] || "", // nhom mau
    // Các field khác giữ nguyên null
    team: row[20], //team
    team_challenge: null,
    id_ticket: null,
    order: null,
    // size: null,
    payment: false,
    checkin: false,
    registry: null,
    age: null,
    age_group: null,
  };
  // validate một số field quan trọng
  if (athlete.email && !validateEmail(athlete.email)) {
    errors.push(`Dòng ${rowNumber}: Email không hợp lệ (${athlete.email})`);
  }
  if (!athlete.name) {
    errors.push(`Dòng ${rowNumber}: Thiếu họ tên`);
  }
  if (!athlete.bib) {
    errors.push(`Dòng ${rowNumber}: Thiếu BIB`);
  }
  if (!athlete.chip) {
    errors.push(`Dòng ${rowNumber}: Thiếu Chip`);
  }

  return athlete;
}
//function table helper
async function tableHelper(data) {
  const athService = new AthleteV1Service();
  const result = await athService.athleteControl(data);
  return result;
}

class EventProcessingController {
  //============Event Initial
  //index event list
  async Index(req, res) {
    try {
      const query = await EventService.listEvent();
      const events = await query.data;
      // console.log(events);
      res.render("admin/eventprocessing/index", {
        layout: VLAYOUT,
        title: "Event Processing",
        events: events,
        status: {
          status: true,
          mess: "AAA",
        },
      });
    } catch (error) {
      console.log(CNAME + " Index " + error);
      res.status(500).render("admin/eventprocessing/index", {
        layout: "layout/layoutAdmin",
        title: "Event Processing",
        events: [],
        status: {
          status: false,
          mess: error,
        },
      });
    }
  }
  // form-create-event
  FormAdd(req, res) {
    res.render(VNAME + "create", {
      layout: VLAYOUT,
      title: "Create Event",
    });
  }
  //ajax
  async Create(req, res) {
    try {
      const data = req.body;
      const result = await EventService.addEvent(data);
      res.json({ success: true, mess: "" });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: error });
    }
  }
  //ajax
  async EditForm(req, res) {
    try {
      const _id = req.params.id;
      var statusOfEvent = await EventService.getStatusOfEvent(_id);
      var result = await EventService.findEventById(_id);
      res.render(VNAME + "edit", {
        layout: VLAYOUT,
        title: "Edit Event",
        currentStatus: 1, // vẫn truyền để JS biết bước đầu tiên
        eventId: _id, // truyền id xuống view để JS fetch kèm id
        event: result.data,
        status: statusOfEvent.data,
      });
    } catch (error) {
      console.log(CNAME + error);
      res.render(VNAME + "edit", {
        layout: VLAYOUT,
        title: "Edit Event",
      });
    }
  }
  async Update(req, res) {
    try {
      const _id = req.params.id;
      const dataClient = req.body;
      var result = await EventService.updateEvent(_id, dataClient);
      res.send({ status: true, data: "Ajax" });
    } catch (error) {
      console.log(error);
    }
  }
  Detail(req, res) {}
  async Delete(req, res) {
    try {
      const _id = req.params.id;
      var result = await EventService.deleteEvent(_id);
      res.json({ status: true, mess: "Delete success" });
    } catch (error) {
      console.log(error);
    }
  }
  //show-hide 
  async EventShowHide(req, res){
    try {
      const isShow = req.body.status === true || req.body.status === "true";
      const eID = req.body.ei;
      const result = await EventService.changeStatus(eID, isShow)
      res.json({success: true})
    } catch (error) {
      console.log(CNAME+error)
      res.status(500).json({success: false, mess: error})
    }
  }
  //==============Event Management Athlete
  async AthleteIndex(req, res) {
    const _event_id = req.params.id;
    console.log(_event_id);
    //
    const athService = new AthleteV1Service();
    const data = await athService.statsSummary(_event_id);
    const athletes = (await athService.AthleteList(_event_id)).data;
    // console.log(athlete.data)
    // percent
    const ov = data?.overview?.[0] || {
      total: 0,
      checkedIn: 0,
      notCheckedIn: 0,
    };

    const checkinPercent =
      ov.total > 0 ? ((ov.checkedIn / ov.total) * 100).toFixed(2) : 0;

    const notCheckinPercent =
      ov.total > 0 ? (100 - checkinPercent).toFixed(2) : 0;
    // console.log(checkinPercent + " " + notCheckinPercent);
    // console.log("===========================data summary overview");
    // console.log(data.overview);
    // console.log("=========================== data summary group by distance");
    // console.log(data.byDistance);
    //
    // const dataTable ={
    //   event_id : _event_id,
    //   page: req.query.page,
    //   limit: req.query.limit,
    //   search: req.query.search || ""
    // }
    // console.log(dataTable)
    // const result =await tableHelper(dataTable);
    // console.log(result)
    // res.json(result)
    //
    res.render(VNAME + "athlete/index", {
      layout: VLAYOUT,
      title: "Athlete",
      ov: data.overview[0] || [],
      bd: data.byDistance || [],
      checkinPercent,
      notCheckinPercent,
      aths: athletes,
    });
  }
  async LoadPartialView(req, res) {
    try {
      const _event_id = req.query.ei;
      const key = req.query.step;
      const result = await eventService.findEventById(_event_id);
      const status = result.data.status;
      // console.log(status)

      // console.log(_event_id+" "+key)
      switch (key) {
        case "1":
          console.log("action 1");
          res.json({
            success: true,
            redirect: `/admin/eventprocessing/event-detail/${_event_id}`,
          });
          break;
        case "2":
          console.log("action 2");
          res.status(200).json({
            success: true,
            redirect: `/admin/eventprocessing/athlete/${_event_id}`,
          });
          // res.render(VNAME+"athlete/index",{title: 'Athlete', layout: VLAYOUT});
          break;
        default:
          res.json({ success: false });
          break;
      }
    } catch (error) {
      console.log(CNAME + "Loadpartialview: " + error);
      res.status(500).json({ success: false });
    }
  }
  // ajax
  async AthleteImportData(req, res) {
    try {
      const _eventId = req.body.event_id;
      console.log("eventId: " + _eventId);
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, mess: "No file uploaded" });
      }
      //read file
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      //lay sheet theo ten (vd: 'athleta-data')
      const _sheetName = "athlete-data";
      if (!workbook.SheetNames.includes(_sheetName)) {
        return res
          .status(400)
          .json({ success: false, mess: `Sheet ${_sheetName} not found` });
      }
      const worksheet = workbook.Sheets[_sheetName];
      //convert sheet sang JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, {
        header: 1, // lấy raw dạng mảng, không dựa header
        defval: "", // giữ giá trị trống
      });
      if (jsonData.length <= 1) {
        return res
          .status(400)
          .json({ success: false, message: "File Excel không có dữ liệu." });
      }
      // console.log(jsonData);
      const errors = [];
      const athletes = [];
      jsonData.slice(1).forEach((row, i) => {
        const rowNumber = i;
        const athleteData = mapRowByIndex(row, _eventId, rowNumber, errors);
        athletes.push(athleteData);
      });

      // const result = await AthleteEntity.insertMany(athletes);
      // console.log("data sau khi làm sạch: ");
      // console.log(athletes);
      // const result =await Athlete
      //==============INSERT vao DB
      // 🔥 bulk update/insert theo event_id + bib
      const bulkOps = athletes.map((athlete) => {
        const { _id, ...rest } = athlete; // bỏ _id
        return {
          updateOne: {
            filter: {
              event_id: new mongoose.Types.ObjectId(athlete.event_id),
              bib: athlete.bib,
            },
            update: { $set: rest },
            upsert: true,
          },
        };
      });

      const result = await AthleteEntity.bulkWrite(bulkOps, { ordered: false });
      // bo qua loi nhung insert thanh cong
      if (errors.length > 0) {
        console.log(errors);
        return res.json({
          success: false,
          mess: "upload file success but have a lot of errors",
          errors,
        });
      }
      res.json({
        success: true,
        mess: "upload file success",
        nofication: {
          update: result.modifiedCount,
          create: result.upsertedCount,
          status: result.isOk(),
        },
        errors,
      });
    } catch (error) {
      console.log(CNAME + "import athlete " + error);
      res.status(500).json({ false: false, mess: error });
    }
  }
  //ajax
  async AthleteImport(req, res) {}
  //
  //ajax get detail
  async AthleteDetail(req, res) {
    try {
      const eventId = req.body.eventId;
      const athId = req.body.athId;
      console.log(eventId + " - " + athId);
      const athService = new AthleteV1Service();
      const ath = (await athService.GetById(eventId, athId)).data;
      // console.log(ath);
      res.status(200).json({ success: true, ath });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, err: error });
    }
  }
  //ajax update detail
  async AthleteDetailUpdate(req, res) {
    try {
      const _eID = req.body.e_id;
      const _athID = req.params.id;
      const data = req.body;
      const athleteData = {
        bib: data.bib,
        name: data.name,
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
        size: data.size,
      };
      console.log("check data");
      console.log(_athID + " - " + _eID);
      console.log(athleteData);
      const athService = new AthleteV1Service();
      const result = await athService.UpdateById(_athID, _eID, athleteData);
      console.log(result);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, err: error });
    }
  }
  //ajax delete
  async AthleleDetailDelete(req, res) {
    try {
      const _eID = req.body.eid;
      const _athID = req.params.id;
      if (_eID & _athID) {
        console.log("not enough input parameters");
        return res
          .status(500)
          .json({ success: false, mess: "ko du tham so dau vao" });
      }
      const athService = new AthleteV1Service();
      const result = await athService.DeleteById(_athID, _eID);
      if (!result.status) {
        return res.status(500).json({ success: false, mess: result.mess });
      }
      return res.json({ success: true });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: error });
    }
  }
  //ajax import once
  async AthleteImportOnce(req, res) {
    try {
      const _eId = req.params.eid;
      const data = req.body;
      const athService = new AthleteV1Service();
      const result = await athService.athleteImportOnce(_eId, data);
      if (!result) {
        return res
          .status(500)
          .json({ success: false, mess: "them moi bi loi" });
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: error });
    }
  }
  //ajax - api
  async APIAthleteDataTable(req, res) {
    // console.log('running')
    try {
      const data = req.body;
      const eventId = data.ei;
      const limit = data.limit;
      const page = data.page;
      const search = data.search;
      // const sort = data.sort;
      const athService = new AthleteV1Service();
      const dataTransfer = { event_id: eventId, limit, page, search };
      // console.log(dataTransfer);
      const result = await athService.athleteControl(dataTransfer);
      res.json({ success: true, data: result });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: error });
    }
  }
  //ajax - api export -> .xlsx
  async AthleteDataExportExcel(req, res) {
    try {
      const eID = req.body.ei;
      console.log("event chuyen vao: "+eID);
      const athService = new AthleteV1Service();
      const buffer = await athService.athleteExportExcel(eID);
      if (buffer.success) {
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="athletes.xlsx"',
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        return res.send(buffer.buffer);
      }
      res.status(500).json({status: false})
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: error });
    }
  }
  async progressFlowAction(req, res) {
    const steps = [
      { id: 1, label: "Bước 1: Khởi tạo" },
      { id: 2, label: "Bước 2: Xử lý dữ liệu" },
      { id: 3, label: "Bước 3: Gửi thông báo" },
      { id: 4, label: "Bước 4: Hoàn tất" },
    ];
    const currentStatus = req.query.status ? parseInt(req.query.status) : 1; // Lấy status từ query param hoặc mặc định là 1

    res.render("admin/eventprocessing/progressFlow", {
      layout: "layout/layoutAdmin",
      title: "Progress Flow Test",
      steps: steps,
      currentStatus: currentStatus,
    });
  }
  // async testAction(req, res) {
  //   res.render("admin/eventprocessing/test", {
  //     layout: "layout/layoutAdmin",
  //     title: "Test Event Processing",
  //   });
  // }
}

module.exports = new EventProcessingController();
