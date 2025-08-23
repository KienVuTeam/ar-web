const mongoose = require("mongoose");
const slugify = require("slugify");

const AthleteSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", 
      required: true
    },
    bib: { type: String},
    name: { type: String },
    bib_name: { type: String },
    gender: { type: Boolean }, // true = nam, false = nữ (tùy quy ước)
    email: { type: String },
    phone: { type: String },
    dob: {type: Date},
    cccd: { type: String },
    nation: { type: String },
    city: { type: String },
    address: { type: String },
    team: { type: String },
    team_challenge: { type: String },
    id_ticket: { type: String },
    order: { type: String },
    chip: { type: String },
    epc: { type: String },
    distance: { type: String },
    patron_name: { type: String },
    patron_phone: { type: String },
    medical: { type: String },
    blood: { type: String },
    size: { type: String, maxlength: 1 }, // char -> string length 1
    payment: { type: Boolean },
    checkin: { type: Boolean },
    registry: { type: String }, // chưa rõ kiểu => để string
    age: { type: Number },
    age_group: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Athlete", AthleteSchema);
