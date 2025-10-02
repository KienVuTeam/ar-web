const mongoose = require("mongoose");
const xlsx = require("xlsx");
const { FormatDateOnly } = require("../utils/dateUtil");
const Athlete = require("../model/Athlete");
const {chunkArray,mapExcelRowToAthlete,} = require("../utils/mapExcelRowToAthlete");


class AthleteService {
  async UploadExcelToDB(excelBuffer, eventId) {
    let insertLog = [];
    try {
      // Clear existing athlete data for this event before importing new data
      console.log(`[AthleteService] Deleting existing athletes for event: ${eventId}`);
      await Athlete.deleteMany({ event_id: new mongoose.Types.ObjectId(eventId) });
      console.log(`[AthleteService] Existing athletes deleted for event: ${eventId}`);

      console.log(`[AthleteService] Reading Excel buffer.`);
      const workbook = xlsx.read(excelBuffer, { type: 'buffer', cellDates: true });
      const sheetName = workbook.SheetNames.find(
        (name) => name.trim() === "Data"
      );
      if (!sheetName) {
        console.error("[AthleteService] Error: 'Data' sheet not found in Excel file.");
        return { status: false, mess: "Không tìm thấy sheet 'Data'" };
      }
      const sheet = workbook.Sheets[sheetName];

      const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      console.log(`[AthleteService] Raw data rows from Excel: ${rawData.length}`);

      const mappedData = rawData.map((row) => {
        return mapExcelRowToAthlete(row, eventId);
      });
      console.log(`[AthleteService] Mapped data rows: ${mappedData.length}`);

      const BATCH_SIZE = 1000;
      const batches = chunkArray(mappedData, BATCH_SIZE);
      console.log(`[AthleteService] Number of batches for bulk write: ${batches.length}`);

      for (const batch of batches) {
        const bulkOps = batch.map((athlete) => ({
          updateOne: {
            filter: { bib: athlete.bib, event_id: athlete.event_id },
            update: { $set: athlete },
            upsert: true,
          },
        }));

        const result = await Athlete.bulkWrite(bulkOps);
        insertLog.push({
          matched: result.matchedCount,
          insert: result.upsertedCount,
          modified: result.modifiedCount,
        });
        console.log(
          `[AthleteService] Batch done => Matched: ${result.matchedCount}, Inserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`
        );
      }
      return {
        status: true,
        data: insertLog,
      };
    } catch (error) {
      console.error("[AthleteService] Error in UploadExcelToDB:", error);
      return { status: false, mess: `Err_Service: ExcelToDb - ${error.message}` };
    }
  }
  async AthleteList(eventId) {
    // eventId ="689d3e161d99d1e9a91f9682"
    try {
      const athletes = await Athlete.find({
        event_id: new mongoose.Types.ObjectId(eventId),
      }).limit(10).sort({bib: 1}).lean(); // convert string sang ObjectId
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

  async getTotalAthletes(eventId) {
    try {
      const total = await Athlete.countDocuments({ event_id: new mongoose.Types.ObjectId(eventId) });
      return { status: true, data: total };
    } catch (error) {
      console.log(error);
      return { status: false, mess: "AthleteService_getTotalAthletes" };
    }
  }

  async getCheckedInAthletes(eventId) {
    try {
      const checkedIn = await Athlete.countDocuments({
        event_id: new mongoose.Types.ObjectId(eventId),
        checked_in: true, // Assuming 'checked_in' field exists and is a boolean
      });
      return { status: true, data: checkedIn };
    } catch (error) {
      console.log(error);
      return { status: false, mess: "AthleteService_getCheckedInAthletes" };
    }
  }

  async getDistanceStats(eventId) {
    try {
      const stats = await Athlete.aggregate([
        {
          $match: {
            event_id: new mongoose.Types.ObjectId(eventId),
          },
        },
        {
          $group: {
            _id: "$distance", // Group by distance field
            total: { $sum: 1 },
            male: { $sum: { $cond: [{ $eq: ["$gender", "male"] }, 1, 0] } },
            female: { $sum: { $cond: [{ $eq: ["$gender", "female"] }, 1, 0] } },
            checkedIn: { $sum: { $cond: [{ $eq: ["$checked_in", true] }, 1, 0] } },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            total: "$total",
            male: "$male",
            female: "$female",
            checkedIn: "$checkedIn",
            uncheckedIn: { $subtract: ["$total", "$checkedIn"] },
          },
        },
        {
          $sort: { name: 1 } // Sort by distance name
        }
      ]);
      return { status: true, data: stats };
    } catch (error) {
      console.log(error);
      return { status: false, mess: "AthleteService_getDistanceStats" };
    }
  }
  
}

module.exports = AthleteService;
