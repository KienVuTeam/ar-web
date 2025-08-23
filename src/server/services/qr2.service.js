const crypto = require("crypto");
const QRCode = require("qrcode");
require('dotenv').config;

const SECRET_SIGN = process.env.SECRET_KEY_SIGN;   // để sign
const SECRET_ENC  = Buffer.from(process.env.SECRET_KEY_ENC, "hex"); // 32 bytes cho AES-256

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_ENC, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
}

function decrypt(encText) {
  const [ivStr, data] = encText.split(":");
  const iv = Buffer.from(ivStr, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_ENC, iv);
  let decrypted = decipher.update(data, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateSignature(data) {
  return crypto.createHmac("sha256", SECRET_SIGN)
               .update(data)
               .digest("hex");
}

async function generateAthleteQR(athleteId, eventId, expiryDate) {
  // dữ liệu cần encode
  const payload = JSON.stringify({
    athleteId,
    eventId,
    expiryDate
  });

  // mã hóa
  const encrypted = encrypt(payload);

  // ký
  const signature = generateSignature(encrypted);

  // gói QR string
  const qrString = `${encrypted}.${signature}`;

  // tạo QR image base64
  const qrImageBase64 = await QRCode.toDataURL(qrString);

  return { image: qrImageBase64, qr_string: qrString };
}

//=====================giai ma
function decodeAthleteQR(qrString) {
  try {
    const [encrypted, signature] = qrString.split(".");

    // verify chữ ký
    const expectedSig = generateSignature(encrypted);
    if (expectedSig !== signature) {
      return { valid: false, reason: "invalid-signature" };
    }

    // giải mã
    const payload = JSON.parse(decrypt(encrypted));

    // check expiry
    const now = new Date();
    const expiry = new Date(payload.expiryDate);
    if (now > expiry) {
      return { valid: false, reason: "expired", ...payload };
    }

    return { valid: true, ...payload };
  } catch (err) {
    console.error("QR decode error:", err);
    return { valid: false, reason: "error" };
  }
}

module.exports = {generateAthleteQR, decodeAthleteQR}