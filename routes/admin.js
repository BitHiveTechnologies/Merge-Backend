// routes/admin.js
const express = require('express');
const router  = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Enrollment            = require('../models/enrollment');
const WorkshopRegistration  = require('../models/workshopRegistration');
const HackathonRegistration = require('../models/hackathonRegistration');

// List all course enrollments
router.get(
  '/courses/registrations',
  adminAuth,
  async (req, res) => {
    const regs = await Enrollment
      .find()
      .populate('userId', 'name email')
      .populate('courseId', 'title');
    res.json(regs);
  }
);

// List all workshop registrations
router.get(
  '/workshops/registrations',
  adminAuth,
  async (req, res) => {
    const regs = await WorkshopRegistration
      .find()
      .populate('userId', 'name email')
      .populate('workshopId', 'title');
    res.json(regs);
  }
);

// List all hackathon registrations
router.get(
  '/hackathons/registrations',
  adminAuth,
  async (req, res) => {
    const regs = await HackathonRegistration
      .find()
      .populate('userId', 'name email')
      .populate('hackathonId', 'title');
    res.json(regs);
  }
);

module.exports = router;
