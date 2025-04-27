const mongoose = require('mongoose');
const HackathonSchema = new mongoose.Schema({
    title: String,
    organizer: String,
    startDate: Date,
    endDate: Date,
    location: String,
    description: String,
    image: String,
    isLive: Boolean,
    isUpcoming: Boolean,
    tracks: [String],
    structure: [String],
    prizes: [String],
    prerequisites: [String],
    faqs: [{ question: String, answer: String }],
    sponsors: [String],
    judges: [String]
  });
  module.exports = mongoose.model('Hackathon', HackathonSchema);