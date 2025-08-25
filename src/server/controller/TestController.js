const crypto = require("crypto");
require("dotenv").config();
const qrCode = require("qrcode");
const { generateAthleteQR, GiaiMa } = require("../services/qr.service");
const EventService = require("../services/event.service");
const MailService = require("../services/mail.service");
const transporterAWS = require("../config/mailAWSConfig");

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
  async SendMail(req, res) {
    try {
      const email = "kienvu.dev@gmail.com"; //kienidkcgo1001@gmail.com //quanghuynguyen0701@gmail.com
      var qr =
        "data:image/png;base64,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";
      // let replacePrefix = qr.replace(/^data:image\/png;base64,/, "");

      const result = await MailService.sendMail(email, qr);
      res.json({ success: true, message: result });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  //
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
      html: html,
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
}

module.exports = new TestController();
