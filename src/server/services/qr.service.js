// qrService.js
const crypto = require("crypto");
const QRCode = require("qrcode");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY_SIGN; // Bạn giữ bí mật, không chia sẻ

function generateSignature(token) {
  return crypto.createHmac("sha256", SECRET_KEY).update(token).digest("hex");
}

async function generateAthleteQR(tokenTest) {
  // Token là ID document của VĐV, hoặc random string mapping với DB
  const token = tokenTest.toString();

  // Tạo chữ ký
  const signature = generateSignature(token);
  console.log("signature: " + signature);
  console.log("token " + token);

  // Dữ liệu mã hóa trong QR
  const qrData = JSON.stringify({ token, signature });

  // Trả về ảnh QR dưới dạng Base64
  const qrImageBase64 = await QRCode.toDataURL(qrData);
  return qrImageBase64;
}
function GiaiMa(token, signature) {
  // Tính lại signature dựa trên token quét được
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(token)
    .digest("hex");

  // Check trực quan
  if (expectedSignature === signature) {
    console.log("✅ QR hợp lệ, chưa bị sửa");
    // Dùng token để tra cứu VĐV trong DB
  } else {
    console.log("❌ QR bị sửa hoặc giả mạo!");
  }
}

module.exports = { generateAthleteQR, generateSignature, GiaiMa };
