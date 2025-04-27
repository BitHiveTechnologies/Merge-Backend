const mongoose = require('mongoose');
const WorkshopRegistrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
    registrationDate: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model('WorkshopRegistration', WorkshopRegistrationSchema);