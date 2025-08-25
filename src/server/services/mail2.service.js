const transporter = require("../config/mailConfig");
require("dotenv").config();
const QRCode = require("qrcode");
// const { buildMailTemplate } = require("../utils/mail.util");
const {mailTemplate1} = require("../utils/mailTemplateUtil")

async function sendMail2(ath, qr_string) { //email, qrCode


  // Tạo QR code dưới dạng buffer (PNG)
  const qrBuffer = await QRCode.toBuffer(qr_string, { type: "png" });

  const html = mailTemplate1(ath, "cid:qrcode");
  // console.log(html);
  const title = process.env.SECRET_MAIL_USER;
  const subject = "Mã QR tham gia sự kiện";

  return transporter.sendMail({
    from: `"BTC giải chạy" <${title}>`,
    to: ath.email,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrBuffer,
        cid: "qrcode", // Content-ID tham chiếu trong <img>
      },
    ],
  });
}
module.exports = { sendMail2 };
