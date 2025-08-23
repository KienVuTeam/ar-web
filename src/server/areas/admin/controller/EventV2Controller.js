const crypto = require("crypto");
const path = require("path")
const EventService = require("../../../services/event.service");
const FlagCheck = require("../../../utils/flagCheck");
const { generateAthleteQR, GiaiMa } = require("../../../services/qr2.service");
const AthleteService = require("../../../services/athlete.service");

class EventV2Controller {
  Index(req, res) {
    res.send("EventContorller_Index");
  }
  //create event
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
                  status: false,
                  message: "Add event failed"
              })
          }
      }
  //R
  async EventList(req, res) {
    var result = await EventService.listEvent();
    // var FlagStatus = result.status;
    // FlagCheck(FlagStatus);
    res.render("admin/event2/eventList", {
      layout: "layout/layoutAdmin",
      events: result.data,
    });
  }
  // Form Add event
  FormAddEvent(req, res){
        res.render('admin/event2/formAddEvent', {layout: 'layout/layoutAdmin', title: 'Add New Event 2'});
    }
  // 
  async LoadFormEditPartial(req, res) {
    try {
      // const _id = req.query.id;
      const _id = req.params.id;
      console.log(_id);
      // alert(_id)
      var statusOfEvent = await EventService.getStatusOfEvent(_id);
      // FlagCheck(statusOfEvent.status);
      var result = await EventService.findEventById(_id);
      res.render("admin/event2/pageMaster", {
        layout: "layout/layoutAdmin",
        currentStatus: 1, // vẫn truyền để JS biết bước đầu tiên
        eventId: _id, // truyền id xuống view để JS fetch kèm id
        event: result.data,
        status: statusOfEvent.data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  }
  // U
  //[ajax]
      async UpdateEvent(req, res){
        console.log('tests')
          try {
              const _id = req.params.id;
              const dataClient = req.body;
              var result = await EventService.updateEvent(_id, dataClient)
              res.send({status: true, data:'Ajax'})
          } catch (error) {
              console.log(error)
              
          }
      }
  //ajax
  async UploadExcel(req, res) {
      try {
        if (!req.file) {
          return res.status(400).json({status: false, mess: "No file uploaded" });
        }
        const filePath = path.resolve(req.file.path);
        const event_id = req.body.event_id;
        console.log(event_id)
  
        const _athleteService = new AthleteService();
        const result = await _athleteService.UploadExcelToDB(filePath, event_id);
        // FlagCheck(result.status, result.mess)
        res.json({staus:true, mess: result.data})
  
      } catch (error) {
        console.log(error);
        res.json({ status: false, mess: error.message });
      }
    }
  //ajax
  async LoadPartialPage(req, res) {
    function handleReturnView(err, html) {
      if (err) {
        return res.send("Page not found X");
      }
      return res.send(html);
    }
    try {
      const _eventId = req.query.id;
      const step = Number(req.params.step);
      // console.log("Load step:", step);

      switch (step) {
        case 1:
          var result = await EventService.findEventById(_eventId);
          return res.render(
            "admin/partials/formEditEventPartial",
            {
              layout: false,
              event: result.data,
            },
            handleReturnView
          );
        case 2:
          console.log(_eventId)
          var result = await this.AthleteList(_eventId);
          console.log(result.data.length)
          // var result = null;
          if(result.data.length===0){
            return res.render("admin/event2/athleteImport", {layout: false, title: 'import athlete'})
          }
          return res.render(
            "admin/partials/bib",
            { layout: false, athletes: result.data },
            handleReturnView
          );
        case 3:
          return res.render(
            "admin/partials/sendMail",
            { layout: false },
            handleReturnView
          );
        case 4:
          return res.render(
            "admin/partials/checkin",
            { layout: false },
            handleReturnView
          );
        case 5:
          return res.render(
            "admin/partials/finished",
            { layout: false },
            handleReturnView
          );
        default:
          return res.send("⛔ Ko có nội dung cho bước này");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send("Lỗi server");
    }
  }
  //
  async GenerateSign(req, res) {
    try {
      const token = crypto.randomBytes(16).toString("hex");
      console.log(token);
      let dateExpiry = "2025-08-20";
      const qrBase64 = await generateAthleteQR(token, dateExpiry);
      console.log(qrBase64);
      res.render("admin/event2/qrCode", {
        layout: "layout/layoutAdmin",
        qr_code: qrBase64.image,
      });
    } catch (error) {
      console.log(err);
    }
  }
  //gan ma qrcode cho vdv
  async AthleteQrCode() {
    try {
      const eventId = "689d3e161d99d1e9a91f9682";
      var result = EventService.AthleteQrCode(eventId);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }
  //
  async ScanQRCode(req, res) {
    res.render("admin/event2/scanQrCode", { layout: false });
  }
  async ReadQRCode(req, res) {
    console.log("running");
    var qrString = req.body.qr_string;
    const { qr_string } = req.body;

    console.log(qr_string);
    var result = GiaiMa(qr_string);
    res.send({ status: true, link: "/test/scan-success", err_mess: [] });
  }

  //
  async GoToNextStep(req, res) {
    console.log("runnig");
    try {
      const id = req.body.id;
      const status = Number(req.body.status);
      console.log("running " + id + " " + status);
      var changeStatus = await EventService.changeStatus(id, status);
      FlagCheck(changeStatus.status);
      return res.json({ success: true, data: "" });
    } catch (error) {
      return res.json({ success: false, mess: error });
    }
  }
  //fx common
  async AthleteList(eventId) {
    // console.log("can thay eventid");
    // const idEvent = "689d3e161d99d1e9a91f9682";
    const _eventId =eventId;
    try {
      const _athleteService = new AthleteService();
      var result = await _athleteService.AthleteList(_eventId);
      return result;
      // FlagCheck(result.status, result.mess);
      // res.json(result.data)
      //   res.render('admin/athlete/managerAthlete', {layout:'layout/layoutAdmin', athletes: result.data})
    } catch (error) {
      console.log(error);
      // res.json({status: false, data:[]})
    }
  }
}

module.exports = new EventV2Controller();
