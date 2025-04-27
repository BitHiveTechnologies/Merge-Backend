const mongoose = require('mongoose');
const HackathonRegistrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
    teamName: String,
    teamSize: Number,
    track: String,
    registrationDate: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model('HackathonRegistration', HackathonRegistrationSchema);