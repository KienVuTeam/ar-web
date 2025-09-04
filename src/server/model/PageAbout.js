const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sections: mongoose.Schema.Types.Mixed   // cho phép lưu JSON tự do
});

module.exports = mongoose.model('PageAbout', PageSchema);
