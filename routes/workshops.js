const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workshop = require('../models/workshop');
const RegW = require('../models/workshopRegistration');
const PastW = require('../models/pastWorkshop');


router.post('/', async (req, res) => {
  try {
    const workshop = new Workshop(req.body);
    await workshop.save();
    res.status(201).json(workshop);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// GET all workshops
router.get('/', async (req, res) => {
  const list = await Workshop.find();
  res.json(list);
});

// GET past workshops
router.get('/past', async (req, res) => {
  const past = await PastW.find();
  res.json(past);
});

// GET upcoming workshops
router.get('/upcoming', async (req, res) => {
  const upcoming = await Workshop.find({ isUpcoming: true });
  res.json(upcoming);
});

// GET current user’s registrations
router.get('/registrations', auth, async (req, res) => {
  try {
    // pull from the registration model, not Workshop
    const regs = await RegW
      .find({ userId: req.user.id })
      .populate('workshopId');    // brings in the workshop details
    res.json(regs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET specific workshop by ID
router.get('/:id', async (req, res) => {
  const wk = await Workshop.findById(req.params.id);
  res.json(wk);
});

// POST register for a workshop
router.post('/register/:id', auth, async (req, res) => {
  const exists = await RegW.findOne({
    userId: req.user.id,
    workshopId: req.params.id
  });
  if (exists) return res.status(400).json({ msg: 'Already registered' });

  const reg = new RegW({
    userId: req.user.id,
    workshopId: req.params.id
  });
  await reg.save();
  res.json(reg);
});

module.exports = router;