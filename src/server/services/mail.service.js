const transporter = require("../config/mailConfig");
require("dotenv").config();
const QRCode = require("qrcode");
const { buildMailTemplate } = require("../utils/mail.util");

async function sendMail(email, qrCode) {
  // Nội dung bạn đưa
  // const qrContent =
    // "/LzQaXTZSBy79EqmuLUXQw==:cyFxpjJyVDDyYZKt8KdAruwMxoZZGxQ924isRmOkIUYIiNGlVASc1PJKlFMz/oZVSIPIIG0oBwnMIr1nBJNsCYOgfO5JB1ZVj+L6NRnjHGg=.20aee207ad285a74dcbf6dcaf63e4752b5c272c30dd9202cd840af8a91206c91";

  // Tạo QR code dưới dạng buffer (PNG)
  const qrBuffer = await QRCode.toBuffer(qrCode, { type: "png" });

  const html = buildMailTemplate("cid:qrcode");
  // console.log(html);
  const title = process.env.SECRET_MAIL_USER;
  const subject = "Mã QR tham gia sự kiện";

  return transporter.sendMail({
    from: `"BTC giải chạy" <${title}>`,
    to: email,
    subject: subject,
    html: html,
    // html: `
    //   <p>Vui lòng quét QR Code dưới đây:</p>
    //   <img src="cid:qrcode" />
    // `,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrBuffer,
        cid: "qrcode", // Content-ID tham chiếu trong <img>
      },
    ],
  });
}
module.exports = { sendMail };
