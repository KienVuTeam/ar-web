const { name } = require("ejs");
const crypto = require("crypto");
const EventEntity = require("../model/Event");
const { EventStatus } = require("../enums/event.enum");
const AthleteEntity = require("../model/Athlete");
const { generateAthleteQR } = require("./qr2.service");
const QrCodeEntity = require("../model/QRCode");
// const EventEntity = require('../model/Event')

class EventService {
  async listEvent() {
    try {
      var result = await EventEntity.find();
      return { status: true, data: result };
    } catch (error) {
      console.log(error);
      return { stattus: false, data: error };
    }
  }
  async addEvent(dataClient) {
    try {
      var event = new EventEntity({
        name: dataClient.title,
        desc: dataClient.desc,
        slug: dataClient.slug,
        content: dataClient.content,
        imagePath: dataClient.imagePath,
        apiLink: dataClient.apiLink,
        isShow: dataClient.isShow,
        status: 1, //ep kieu
        place: dataClient.place,
        rankType: dataClient.rankType,
        startDate: dataClient.startDate,
        endDate: dataClient.endDate,
        authorityDate: dataClient.authorityDate,
      });

      var result = await event.save();
      return { staus: true, data: result };
    } catch (error) {
      console.log(error);
      return { staus: false, data: error };
    }
  }
  async updateEvent(id, dataClient) {
    try {
      var result = await EventEntity.findByIdAndUpdate(
        id,
        {
          $set: {
            name: dataClient.title,
            desc: dataClient.desc,
            slug: dataClient.slug,
            content: dataClient.content,
            imagePath: dataClient.imagePath,
            apiLink: dataClient.apiLink,
            isShow: dataClient.isShow,
            status: Number(dataClient.eventStatus),
            place: dataClient.place,
            rankType: dataClient.rankType,
            startDate: dataClient.startDate,
            endDate: dataClient.endDate,
            authorityDate: dataClient.authorityDate,
          },
        },
        { new: true } // Trả về document mới sau khi update
      );

      return { status: true, data: true };
    } catch (error) {
      console.log(error);
      return { status: false, data: true };
    }
  }
  async deleteEvent(id) {
    try {
      await EventEntity.deleteOne({ _id: id });
      return { status: true };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }
  // [Non action]
  formatDate(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  }
  async getStatusOfEvent(_id) {
    try {
      var event = await EventEntity.findById(_id).lean(); //document
      let statusEvent = event.status;
      return { status: true, data: statusEvent };
    } catch (error) {
      return { status: false, data: "" };
    }
  }
  async findEventById(_id) {
    try {
      var result = await EventEntity.findById(_id); //mongoose document
      result = result.toObject(); //loc du lieu thuan
      var resultHandle = {
        ...result,
        startDate: this.formatDate(result.startDate),
        endDate: this.formatDate(result.endDate),
        authorityDate: this.formatDate(result.authorityDate),
      };
      return { status: true, data: resultHandle };
    } catch (error) {
      console.log(error);
      return { status: false, data: error };
    }
  }
  //
  async changeStatus(id, status) {
    try {
      var update = await EventEntity.updateOne(
        { _id: id }, // Điều kiện tìm document
        { $set: { status: status } } // Field cần cập nhật
      );
      return { status: true, data: "" };
    } catch (error) {
      console.log(error);
      return { status: false, data: "" };
    }
  }
  async AthleteQrCode(eventId) {
    const athletes = await AthleteEntity.find({ event_id: eventId });

    let dateExpiry = "2025-08-20"; // hạn QR (có thể lấy từ event.endDate nếu muốn)

    const bulkOps = await Promise.all(
      athletes.map(async (athlete) => {
        // generate QR cho từng VĐV
        const { qr_string } = await generateAthleteQR(
          athlete._id.toString(),
          eventId.toString(),
          dateExpiry
        );

        return {
          updateOne: {
            filter: { athlete_id: athlete._id, event_id: eventId },
            update: {
              $setOnInsert: {
                athlete_id: athlete._id,
                event_id: eventId,
                qr_token: qr_string, // chỉ lưu string
                is_used: false,
                expired_at: new Date(dateExpiry),
              },
            },
            upsert: true,
          },
        };
      })
    );

    const result = await QrCodeEntity.bulkWrite(bulkOps);
    return {
      status: true,
      inserted: result.upsertedCount,
      matched: result.matchedCount,
    };
  }
}

module.exports = new EventService();
