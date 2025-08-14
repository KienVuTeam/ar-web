const { name } = require("ejs");
const EventEntity = require("../model/Event");
const { EventStatus } = require("../enums/event.enum");
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
        slug: dataClient.slug,
        content: dataClient.content,
        imagePath: dataClient.imagePath,
        apiLink: dataClient.apiLink,
        isShow: dataClient.isShow,
        status: Number(dataClient.eventStatus), //ep kieu
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
  async deleteEvent(id){
      try {
        await EventEntity.deleteOne({_id: id});
        return {status: true}
    } catch (error) {
        console.log(error)
        return {status: false}
    }
  }
  // [Non action]
  formatDate(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
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
}

module.exports = new EventService();
