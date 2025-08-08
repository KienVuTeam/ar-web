const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model('Info', exampleSchema);
