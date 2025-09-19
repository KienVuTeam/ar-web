const crypto = require("crypto");
const path = require("path");

const EventService = require("../../../services/event.service");
const FlagCheck = require("../../../utils/flagCheck");
const {
  generateAthleteQR,
  decodeAthleteQR,
} = require("../../../services/qr2.service");
const AthleteService = require("../../../services/athlete.service");
const QRCodeEntity = require("../../../model/QRCode");
const mailService = require("../../../services/mail.service");
const mailService2 = require("../../../services/mail2.service")

class EventV2Controller {
  Index(req, res) {
    res.send("EventContorller_Index");
  }
  //create event
  async AddEvent(req, res) {
    try {
      const dataSend = req.body;
      const result = await EventService.addEvent(dataSend);
      var FlagStatus = result.staus;
      FlagCheck(FlagStatus);

      res.json({ status: true, mess: "" });
    } catch (error) {
      console.log(error);
      res.json({
        status: false,
        message: "Add event failed",
      });
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
  FormAddEvent(req, res) {
    res.render("admin/event2/formAddEvent", {
      layout: "layout/layoutAdmin",
      title: "Add New Event 2",
    });
  }
  //
  async LoadFormEditPartial(req, res) {
    try {
      const _id = req.params.id;
      console.log(_id);
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
  async UpdateEvent(req, res) {
    // console.log("tests");
    try {
      const _id = req.params.id;
      const dataClient = req.body;
      var result = await EventService.updateEvent(_id, dataClient);
      res.send({ status: true, data: "Ajax" });
    } catch (error) {
      console.log(error);
    }
  }
  //ajax
  async UploadExcel(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: false, mess: "No file uploaded" });
      }
      const filePath = path.resolve(req.file.path);
      const event_id = req.body.event_id;
      console.log(event_id);

      const _athleteService = new AthleteService();
      const result = await _athleteService.UploadExcelToDB(filePath, event_id);
      // FlagCheck(result.status, result.mess)
      res.json({ staus: true, mess: result.data });
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
            handleReturnView,
          );
        case 2:
          var result = await this.AthleteList(_eventId);
          if (result.data.length === 0) {
            return res.render("admin/event2/athleteImport", {
              layout: false,
              title: "import athlete",
            });
          }
          return res.render(
            "admin/partials/bib",
            { layout: false, athletes: result.data },
            handleReturnView,
          );
        case 3:
          return res.render(
            "admin/partials/sendMail",
            { layout: false },
            handleReturnView,
          );
        case 4:
          return res.render(
            "admin/partials/checkin",
            { layout: false },
            handleReturnView,
          );
        case 5:
          return res.render(
            "admin/partials/finished",
            { layout: false },
            handleReturnView,
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
    const _eventId = eventId;
    try {
      const _athleteService = new AthleteService();
      var result = await _athleteService.AthleteList(_eventId);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  // send Mail To Athlete
  async sendMailQRToAthlete(req, res) {
    try {
      //
      console.log("running");
      const _eventId = req.body.event_id;
      const _dateExpiry = new Date(req.body.date_expiry);
      const _title = req.body.title;
      const _content = req.body.content;
      console.log(_eventId + " " + _dateExpiry + " " + _title + " " + _content);
      //

      var _athleteService = new AthleteService();
      var result = await _athleteService.AthleteList(_eventId);
      var athletes = result.data;
      // console.log(athletes);
      const batchSize = 20;
      for (let i = 0; i < athletes.length; i += batchSize) {
        const batch = athletes.slice(i, i + batchSize);
        console.log(i);
        await Promise.allSettled(
          // batch
          batch.map(async (athlete) => {
            try {
              let _mail = athlete.email;
              let _athlete_id = athlete._id;
              // let _athlete_mail = athlete.email;
              //tao qr codestring ma hoa
              const qrGen = await generateAthleteQR(
                _athlete_id,
                _eventId,
                _dateExpiry,
              );
              let _qr_string = qrGen.qr_string;
              // luu vao db
              // const _qrcode = new QRCodeEntity({
              //   athlete_id: _athlete_id,
              //   event_id: _eventId,
              //   qr_token: _qr_string,
              //   expired_at: _dateExpiry,
              // });
              // await _qrcode.save();
              //
              await QRCodeEntity.findOneAndUpdate(
                { athlete_id: _athlete_id, event_id: _eventId }, // điều kiện tìm
                {
                  qr_token: _qr_string,
                  expired_at: _dateExpiry,
                },
                { upsert: true, new: true }, // nếu chưa có thì tạo mới, có rồi thì update
              );
              //send mail
              await mailService.sendMail(_mail, _qr_string);
              console.log(`✅ Sent to ${athlete.email}`);
            } catch (err) {
              console.error(`❌ Failed to send ${athlete.email}`, err);
            }
          }),
        );

        // nhỏ giọt cho đỡ bị chặn
        await new Promise((r) => setTimeout(r, 1000));
      }
      res.json({ success: true, mess: "Ok" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, mess: "Faild ...." });
    }
  }
  // 2
  // send Mail To Athlete
  async sendMailQRToAthlete2(req, res) {
    try {
      //
      console.log("running");
      const _eventId = req.body.event_id;
      const _dateExpiry = new Date(req.body.date_expiry);
      const _title = req.body.title;
      const _content = req.body.content;
      console.log(_eventId + " " + _dateExpiry + " " + _title + " " + _content);
      //

      var _athleteService = new AthleteService();
      var result = await _athleteService.AthleteList(_eventId);
      var athletes = result.data;
      // console.log(athletes);
      const batchSize = 20;
      for (let i = 0; i < athletes.length; i += batchSize) {
        const batch = athletes.slice(i, i + batchSize);
        console.log(i);
        await Promise.allSettled(
          // batch
          batch.map(async (athlete) => {
            try {
              // let _mail = athlete.email;
              let _athlete_id = athlete._id;
              // let _athlete_mail = athlete.email;
              //tao qr codestring ma hoa
              const qrGen = await generateAthleteQR(
                _athlete_id,
                _eventId,
                _dateExpiry,
              );
              let _qr_string = qrGen.qr_string;
              //luu vao db bang qrcode
              await QRCodeEntity.findOneAndUpdate(
                { athlete_id: _athlete_id, event_id: _eventId }, // điều kiện tìm
                {
                  qr_token: _qr_string,
                  expired_at: _dateExpiry,
                },
                { upsert: true, new: true }, // nếu chưa có thì tạo mới, có rồi thì update
              );
              //send mail
              await mailService2.sendMail2(athlete, _qr_string);
              console.log(`✅ Sent to ${athlete.email}`);
            } catch (err) {
              console.error(`❌ Failed to send ${athlete.email}`, err);
            }
          }),
        );

        // nhỏ giọt cho đỡ bị chặn
        await new Promise((r) => setTimeout(r, 1000));
      }
      res.json({ success: true, mess: "Ok" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, mess: "Faild ...." });
    }
  }
  //send mail person
  async sendMailPersional(req, res){
    try {
      console.log("gui mail person thong tin cung")
      // _email = req.query.mail;
      var _eventId ="689d3e161d99d1e9a91f9682";
      var _athleteId = "68abe27615f1b67a11b4c100";
      var _dateExpiry = new Date("2025-08-30")
      var _athleteService = new AthleteService();
      var athleteObject =await _athleteService.GetById(_eventId, _athleteId)
      var ath = athleteObject.data;
      // console.log(ath)

      //generate Qr code
      var qrGen = await generateAthleteQR(_athleteId, _eventId, _dateExpiry);
      var qrString = qrGen.qr_string;
      //send mail
      await mailService2.sendMail2(ath, qrString);
      console.log("✅ Send to "+ath.email)
      res.json({success: true, mess: ath.email})
    } catch (error) {
      console.log(error);
      res.json({ success: false, mess: error });
    }
  }
  //athlete ajax
  // async AthleteListAjax(req, res){
  //   var result = this.AthleteList()
  //   return result;
  // }
}

module.exports = new EventV2Controller();
