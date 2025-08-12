const EventService = require('../../../services/event.service');

class EventController{
    
    async Index(req, res){
        // res.send("Admin: event cpntroller index");
        var result =await EventService.listEvent();
        var FlagStatus = result.staus;
            if(FlagStatus){
                console.log('🚩 check: 🟢')
            }else{
                console.log('🚩 check: 🔴')
            }
        res.render('admin/event/index', {layout: 'layout/layoutAdmin', title: 'Event Management', events: result.data });
    }
    FormAddEvent(req, res){
        // res.send("Admin: event cpntroller form add event");
        res.render('admin/event/formAddEvent', {layout: 'layout/layoutAdmin', title: 'Add New Event'});
    }
    async AddEvent(req, res){
        try {
            const dataSend = req.body;
            const result = await EventService.addEvent(dataSend);
            var FlagStatus = result.staus;
            if(FlagStatus){
                console.log('🚩 check: 🟢')
            }else{
                console.log('🚩 check: 🔴')
            }
            res.json(result);
        } catch (error) {
            console.log(error);
            res.json({
                status: 500,
                message: "Add event failed"
            })
        }
    }
}


module.exports = new EventController();