const xlsx = require('xlsx');
const eventService = require("../../../services/event.service");
const EventService = require("../../../services/event.service");
const CNAME = "EventProcessingController: ";
const VNAME = "admin/eventprocessing/";
const VLAYOUT = "layout/layoutAdmin";

//function helper
function normalizeGender(val) {
  if (!val) return null;
  const v = val.toString().trim().toLowerCase();
  if (["m", "male", "nam"].includes(v)) return "M";
  if (["f", "female", "nữ", "nu"].includes(v)) return "F";
  return null;
}

class EventProcessingController {

  
  //============Event Initial
  //index event list
  async Index(req, res) {
    try {
      const query = await EventService.listEvent();
      const events = await query.data;
      console.log(events);
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
      const result =await EventService.addEvent(data);
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
      console.log("OAA")
      const _id = req.params.id;
      console.log(typeof _id);
      var result = await EventService.deleteEvent(_id);
      // FlagCheck(result.status);
      // res.redirect('/admin/event')
      res.json({ status: true, mess: "Delete success" });
    } catch (error) {
      console.log(error);
    }
  }
  //==============Event Management Athlete
  AthleteIndex(req, res){
    res.render(VNAME+"athlete/index", {layout: VLAYOUT, title: "Athlete"})
  }
  async LoadPartialView(req, res){
    try {
      const _event_id = req.query.ei;
      const key = req.query.step;
      const result =await eventService.findEventById(_event_id);
      const status = result.data.status;
      // console.log(status)

      // console.log(_event_id+" "+key)
      switch (key) {
        case "1":
          console.log("action 1");
          res.json({success: true, redirect: `/admin/eventprocessing/event-detail/${_event_id}`})
          break;
        case "2": 
        console.log("action 2")
        res.status(200).json({success: true, redirect: '/admin/eventprocessing/athlete'})
        // res.render(VNAME+"athlete/index",{title: 'Athlete', layout: VLAYOUT});
          break;
        default:
          res.json({success: false})
          break;
      }
    } catch (error) {
      console.log(CNAME+"Loadpartialview: "+error);
      res.status(500).json({success: false})
    }
  }
  // ajax
  async AthleteImportData(req, res){
    try {
      if(!req.file){
        return res.status(400).json({success: false, mess: "No file uploaded"});
      }
      //read file
      const workbook = xlsx.read(req.file.buffer, {type: "buffer"});
      //lay sheet theo ten (vd: 'athleta-data')
      const _sheetName = 'athlete-data';
      if(!workbook.SheetNames.includes(_sheetName)){
        return res.status(400).json({success: false, mess: `Sheet ${_sheetName} not found`});
      }
      const worksheet = workbook.Sheets[_sheetName];
      //convert sheet sang JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet).slice(1);
      if (jsonData.length <= 1) {
          return res
            .status(400)
            .json({ success: false, message: "File Excel không có dữ liệu." });
        }
      console.log(jsonData);
      res.json({success: true, mess: 'upload file success'})
      
    } catch (error) {
      console.log(CNAME+"import athlete "+error)
      res.status(500).json({success: false, mess: error })
    }
  }
  async AthleteImport(req, res){}











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
