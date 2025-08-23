const fs = require("fs");
const path = require("path");
const { generateAthleteQR, decodeAthleteQR } = require("../services/qr2.service");

class QrController {
  // API: /qr/:athleteId
  static async getQr(req, res) {
    try {
      const { athleteId } = req.params;
      const eventId = "event123"; // test tạm
      const expiryDate = "2025-12-31";

      const { image, qr_string } = await generateAthleteQR(
        athleteId,
        eventId,
        expiryDate
      );

      // --- cách 1: trả ảnh QR code trực tiếp (Base64) ---
      // res.send(`<img src="${image}" />`);

      // --- cách 2: trả JSON gồm cả QR string ---
      res.json({
        athleteId,
        eventId,
        expiryDate,
        qr_string,
        qr_image: image,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi tạo QR code" });
    }
  }
  //API: qr/read-qr
//   static readQr(req, res){
//     const {qr_string} = req.body;
//     console.log( qr_string)

//   }
  //API: qr/scan-qr
  static scanQr(req, res){
    res.render('pages/test/scanQr', {layout: false})
  }
  // API: /qr/decode
  
  static decodeQr(req, res) {
    // console.log("runn "+i++)
    try {
      const { qr_string } = req.body;
      if (!qr_string) return res.status(400).json({ error: "Thiếu qr_string" });

      const decoded = decodeAthleteQR(qr_string);
    //   console.log(decoded)
      res.json(decoded);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi decode QR" });
    }
  }
}

module.exports = QrController;
