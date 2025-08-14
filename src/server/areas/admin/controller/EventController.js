const EventService = require('../../../services/event.service');
const FlagCheck = require('../../../utils/flagCheck');

class EventController{
    
    async Index(req, res){
        var result =await EventService.listEvent();
        // var FlagStatus = result.status;
        // FlagCheck(FlagStatus);
        res.render('admin/event/index', {layout: 'layout/layoutAdmin', title: 'Event Management', events: result.data }); //result.data
    }
    FormAddEvent(req, res){
        res.render('admin/event/formAddEvent', {layout: 'layout/layoutAdmin', title: 'Add New Event'});
    }
    async AddEvent(req, res){
        try {
            const dataSend = req.body;
            const result = await EventService.addEvent(dataSend);
            var FlagStatus = result.staus;
            FlagCheck(FlagStatus)

            res.json({status: true, mess: ''});

        } catch (error) {
            console.log(error);
            res.json({
                status: 500,
                message: "Add event failed"
            })
        }
    }
    async FormEditEvent(req, res){
        try {
            
            const _id = req.query.id;
            // console.log('id: '+_id)
            var eventObject =await EventService.findEventById(_id)
            // console.log(eventObject)
            FlagCheck(eventObject.status)
            res.render('admin/event/formEditEvent', {layout: 'layout/layoutAdmin', title: 'edit event', event: eventObject.data})
        } catch (error) {
            res.render('admin/event/formEditEvent', {layout: 'layout/layoutAdmin', title: 'edit event', event:{} })
        }
    }
    //[ajax]
    async UpdateEvent(req, res){
        try {
            const _id = req.params.id;
            const dataClient = req.body;
            var result = await EventService.updateEvent(_id, dataClient)
            res.send({status: true, data:'Ajax'})
        } catch (error) {
            console.log(error)
            
        }
    }
    //
    async DeleteEvent(req, res){
        console.log('runn')
        try {
            const _id = req.params.id;
            console.log(typeof _id)
            var result = await EventService.deleteEvent(_id);
            FlagCheck(result.status);
            // res.redirect('/admin/event')
            res.json({status: true, mess:'Delete success'})
            
        } catch (error) {
            console.log(error)

        }
    }
}


module.exports = new EventController();