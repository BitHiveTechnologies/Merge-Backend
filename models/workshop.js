const mongoose = require('mongoose');
const WorkshopSchema = new mongoose.Schema({
    title: String,
    date: Date,
    time: String,
    location: String,
    instructor: String,
    description: String,
    price: Number,
    image: String,
    isUpcoming: Boolean,
    tags: [String]
  });
  module.exports = mongoose.model('Workshop', WorkshopSchema);
  