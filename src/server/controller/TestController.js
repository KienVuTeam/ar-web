const crypto = require("crypto");
require("dotenv").config();
const qrCode = require("qrcode");
const { generateAthleteQR, GiaiMa } = require("../services/qr.service");
const EventService = require("../services/event.service");
const MailService = require("../services/mail.service");
const transporterAWS = require("../config/mailAWSConfig");
const AthleteV1 = require("../services/AthleteV1.service");

class TestController {
  async Index(req, res) {
    // Lưu VĐV vào DB
    // const athlete = await Athlete.create(req.body);
    const token = crypto.randomBytes(16).toString("hex");
    console.log(token);

    // Tạo QR code
    const qrBase64 = await generateAthleteQR(token);

    // Gửi email
    res.render("pages/test/qrTest", { qr: qrBase64, layout: false });
    // await sendEmail({
    //   to: athlete.email,
    //   subject: "QR Code đăng ký",
    //   html: `<p>Cảm ơn bạn đã đăng ký!</p><img src="${qrBase64}" />`,
    // });

    // res.json({ status: true, message: "Đăng ký thành công và đã gửi QR" });

    // res.send("TestController Action: Index");
  }
  ScanQR(req, res) {
    res.render("pages/test/scan", { layout: false });
  }
  ReadQR(req, res) {
    const SECRET_KEY = process.env.SECRET_KEY_SIGN;
    // 1. Tạo lại signature từ token
    const { token, signature } = req.body;
    const expectedSig = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(token)
      .digest("hex");

    if (signature !== expectedSig) {
      return res.status(400).json({ status: false, message: "QR bị sửa!" });
    }
    console.log(expectedSig);
    // return res.json(expectedSig)
    res.json({ status: true, link: "/test/scan-success", err_mess: [] });
  }
  ScanSuccess(req, res) {
    res.render("pages/test/infoOfAthlete", { layout: false });
  }
  //   -----TEST

  Progess(req, res) {
    res.render("pages/test/progress", { currentStatus: 1, layout: false });
  }
  PageStep(req, res) {
    const step = req.params.step;
    console.log("step: " + step);
    res.render(`partials/partial${step}`, { layout: false }, (err, html) => {
      if (err) return res.send("Không có nội dung cho bước này");
      res.send(html);
    });
  }

  CompleteStep(req, res) {
    const currentStep = parseInt(req.params.step);
    const nextStep = currentStep + 1;

    // TODO: Update DB với status mới (nextStep)
    // ví dụ:
    // await User.updateOne({ _id: req.user._id }, { status: nextStep });

    res.json({ success: true, nextStep });
  }
  //test ma qr
  async AssigmentQrCode(req, res) {
    try {
      const idEvent = "689d3e161d99d1e9a91f9682";
      var result = await EventService.AthleteQrCode(idEvent);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
}
  //test send mail
  async TestSendMailAWS(req, res) {
    console.log("runn here");
    console.log(
      process.env.AWS_MAIL_USER + " " + process.env.AWS_MAIL_PASSWORD,
    );
    const from = "kienidkcgo100103@gmail.com";
    const to = "kienvu.dev@gmail.com";
    const title = "Test gửi mail qua Amazon SES";
    let content = "Hello nguoi ban nho";
    const qrContent =
      "/LzQaXTZSBy79EqmuLUXQw==:cyFxpjJyVDDyYZKt8KdAruwMxoZZGxQ924isRmOkIUYIiNGlVASc1PJKlFMz/oZVSIPIIG0oBwnMIr1nBJNsCYOgfO5JB1ZVj+L6NRnjHGg=.20aee207ad285a74dcbf6dcaf63e4752b5c272c30dd9202cd840af8a91206c91";
    // Tạo QR code dưới dạng buffer (PNG)
    const qrBuffer = await qrCode.toBuffer(qrContent, { type: "png" });
    let html = `<!DOCTYPE html>
<html>
  <body>
    <h2>Chao: ${to}</h2>
    <p>Đây là email test đơn giản.</p>
    <img src="cid:qrcode" alt="QR Code" style="width:200px; height:200px; display:inline-block border: 1px solid #eee; border-radius:10px; margin-bottom:30px;" />
  </body>
</html>
`;

    const mailOpitons = {
      from: `"BTC giải chạy" <${from}>`,
      to: to,
      subject: title,
      // text: content
      attachments: [
        {
          filename: "qrcode.png",
          content: qrBuffer,
          cid: "qrcode", // Content-ID tham chiếu trong <img>
        },
      ],
    };
    //
    transporterAWS.sendMail(mailOpitons, (err, info) => {
      if (err) {
        console.log("lỗi gửi: " + err);
        return res.json({ sucess: false, mess: err });
      } else {
        console.log("gui thanh cong: ", info);
        return res.json({ success: true, mess: info });
      }
    });
  }
  // gg mal
  async sendMailGG(req, res){
    const to ="dangtuongvi0202@gmail.com" //kienvu.dev@gmail.com
    var result =await MailService.sendMail(to);
    res.json(result)
  }
  //test page trang chu
  HomePage(req, res){
    res.render("pages/test-home-page", {layout: false})
  }
  async loadData(req, res){
    const eventID = req.query.ei;
    const page = req.query.page;
    const limit = req.query.limit;
    const search = req.query.search;
    const sort ="";
    const dataPass = {eventID, page, limit, search}
    console.log(dataPass)
    const athService = new  AthleteV1();
    const list =await athService.athleteControl(dataPass);
    res.json(list);
  }
}

module.exports = new TestController();