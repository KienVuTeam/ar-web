const mongoose = require('mongoose')
const slugify = require('slugify')

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: false},
    desc: {type: String, required: true},
    content: {type: String, required: true},
    keyMeta: {type: String, required: false},
    descMeta: {type: String, required: false},
    imageFolder: {type: String, required: true},

},{timestamps: true}
)

module.exports = mongoose.model('Post', PostSchema);
