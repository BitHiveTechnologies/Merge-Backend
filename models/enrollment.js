const mongoose = require('mongoose');
const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});
module.exports = mongoose.model('Enrollment', EnrollmentSchema);