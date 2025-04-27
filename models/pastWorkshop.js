const mongoose = require('mongoose');
const PastWorkshopSchema = new mongoose.Schema({
    institution: String,
    date: Date,
    topic: String,
    highlights: String,
    mediaLinks: [String]
  });
  module.exports = mongoose.model('PastWorkshop', PastWorkshopSchema);