const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Enrollment = require('../models/enrollment');
const Reg = require('../models/hackathonRegistration');
const RegW = require('../models/workshopRegistration');

// GET profile
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});
// PUT update profile
router.put('/profile', auth, async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('-password');
  res.json(user);
});
// GET user enrollments
router.get('/enrollments', auth, async (req, res) => {
  const enroll = await Enrollment.find({ userId: req.user.id }).populate('courseId');
  res.json(enroll);
});
// GET user registrations
router.get('/registrations', auth, async (req, res) => {
  const hackRegs = await Reg.find({ userId: req.user.id }).populate('hackathonId');
  const workRegs = await RegW.find({ userId: req.user.id }).populate('workshopId');
  res.json({ hackathons: hackRegs, workshops: workRegs });
});

module.exports = router;

