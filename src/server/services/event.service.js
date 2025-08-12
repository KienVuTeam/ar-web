const { name } = require('ejs');
const EventEntity = require('../model/Event');
const {EventStatus} = require('../enums/event.enum');
// const EventEntity = require('../model/Event')

class EventService{
    async listEvent(){
        try {
            var result = await EventEntity.find();
            return {staus: true, data: result}; 
        } catch (error) {
            console.log(error)
            return {staus: false, data: error}
        }
    }
    async addEvent(dataClient){
        
        try {
            var event =new EventEntity({
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
                authorityDate: dataClient.authorityDate
            });

            var result = await event.save();
            return {staus: true, data: result};
        } catch (error) {
            console.log(error);
            return {staus: false, data: error};
        }
    }
}

module.exports = new EventService();