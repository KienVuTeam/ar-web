const mongoose = require("mongoose");

const QrCodeSchema = new mongoose.Schema(
  {
    athlete_id: { type: mongoose.Schema.Types.ObjectId, ref: "Athlete", required: true },
    event_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },

    qr_token:   { type: String, required: true, unique: true }, // mã sinh ra từ date+token+sign
    expired_at: { type: Date },   // ngày hết hạn
    is_used:    { type: Boolean, default: false }, // đã checkin chưa?

    qr_base64:  { type: String }, // optional: ảnh QR để cache
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrCode", QrCodeSchema);
