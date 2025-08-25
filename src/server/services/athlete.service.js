const mongoose = require("mongoose");
const xlsx = require("xlsx");
const { FormatDateOnly } = require("../utils/dateUtil");
const Athlete = require("../model/Athlete");
const {chunkArray,mapExcelRowToAthlete,} = require("../utils/mapExcelRowToAthlete");


class AthleteService {
  async UploadExcelToDB(filePath, eventId) {
    let insertLog = [];
    try {
      const workbook = xlsx.readFile(filePath, { cellDates: true });
      const sheetName = workbook.SheetNames.find(
        (name) => name.trim() === "Data"
      );
      if (!sheetName) {
        return res.status(400).json({ error: "Không tìm thấy sheet 'Data'" });
      }
      if (!sheetName) {
        throw new Error("Không tìm thấy sheet 'Data'");
      }
      const sheet = workbook.Sheets[sheetName];

      // const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      // rawData.shift(); // bỏ dòng header?

      // Lúc này rawData[0] là dòng đầu tiên, rawData[0][0] là ô đầu tiên

      // Giả sử eventId lấy từ query hoặc body
      // var eventId = req.body.eventId || null;
      // eventId = "689d3e161d99d1e9a91f9682"; //689d3e161d99d1e9a91f9682 || 689d4480638544c8d475a5c8

      const mappedData = rawData.map((row) => {
        return mapExcelRowToAthlete(row, eventId);
      });
      console.log("data type of mappedData: " + typeof mappedData);
      const BATCH_SIZE = 1000;
      //
      // Chỉ cần chạy 1 lần khi khởi tạo dự án
      // Athlete.collection.createIndex({ event_id: 1, bib: 1 }, { unique: true });
      //
      const batches = chunkArray(mappedData, BATCH_SIZE); //chia cac batch thanh 1000 phan tu
      //for để insert trong mảng batches
      for (const batch of batches) {
        // Tạo danh sách thao tác bulk
        const bulkOps = batch.map((athlete) => ({
          updateOne: {
            filter: { bib: athlete.bib, event_id: athlete.event_id },
            update: { $set: athlete },
            upsert: true,
          },
        }));

        // Gửi lệnh bulk lên MongoDB
        const result = await Athlete.bulkWrite(bulkOps);
        //catch err
        //
        insertLog.push({
          matched: result.matchedCount, // matchedCount -> Số document trong DB mà filter tìm thấy. (Tức là số record trùng bib + event_id mà nó match được.)
          insert: result.upsertedCount, // upsertedCount → Số document được insert mới do không tìm thấy bản ghi trùng.
          modified: result.modifiedCount, // modifiedCount → Số document đã được update vì match được và có dữ liệu thay đổi.
        });
        console.log(
          `Batch done => Matched: ${result.matchedCount}, Inserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`
        );
        //catch err end
      }
      return {
        status: true,
        data: insertLog,
      };
    } catch (error) {
      console.log(error);
      return { status: false, mess: "Err_Service: ExcelToDb" };
    }
  }
  //GetList
  async AthleteList(eventId) {
    // eventId ="689d3e161d99d1e9a91f9682"
    try {
      const athletes = await Athlete.find({
        event_id: new mongoose.Types.ObjectId(eventId),
      }).lean(); // convert string sang ObjectId
      var dataFormatDate = athletes.map((item, index)=>({
        ...item,
        dob: FormatDateOnly(item.dob)
      }))
      return { status: true, data: dataFormatDate};
    } catch (error) {
      console.log(error);
      return { status: false, mess: "AthleteSetvice_List" };
    }
  }
  //GetById
  async GetById(eventId, athleteId) {
    try {
      const result = await Athlete.findOne({
        _id: athleteId,
        event_id: eventId,
      }).lean();
      return { status: true, data: result };
    } catch (error) {
      console.log(error);
      return { status: false, mess: "AthleteService_GetById" };
    }
  }
  // Update
  async UpdateById(id, eventId, udpateData) {
    try {
      const result = await Athlete.updateOne(
        {
          _id: id,
          event_id: eventId,
        },
        { $set: udpateData }
      );
      console.log(result.modifiedCount + " - " + result.matchedCount);
      return { status: true, data: result };
    } catch (error) {
      console.log(error);
      return { status: false, mess: "AthleteService_UpdateById" };
    }
  }
  //DeleteById
  async DeleteById(id, eventId) {
    try {
      const result = await Athlete.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
        event_id: new mongoose.Types.ObjectId(eventId),
      });
      return{status: true, data: result}
    } catch (error) {
      console.log(error)
      return {status: false, mess: 'AthleteService_DeleteById'}
    }
  }
}

module.exports = AthleteService;
