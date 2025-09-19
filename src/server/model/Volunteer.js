const mongoose = require('mongoose')
const slugify = require('slugify');

const VolunteerShema = new mongoose.Schema({
    fullname: {type: String}, 
    cccd: {type: String},
    gender: {type: Boolean},
    DOB: {type: Date},
    email: {type: String},
    phone_number: {type: String},
    role: {type: String},
    event_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true} 
}, {timestamps: true});

module.exports = mongoose.model("Volunteer", VolunteerShema);

