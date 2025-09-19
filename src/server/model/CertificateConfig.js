const mongoose = require('mongoose')
const slugify = require('slugify')

const CertificateconfigSchame = new mongoose.Schema({
    // _id: {type: String},
    event_id: {type: mongoose.Schema.ObjectId, ref: "Event", require: true},
    type: {type: String},
    img_path: {type: String}
    
}, {strict: false})

module.exports = mongoose.model("certificate_config", CertificateconfigSchame)