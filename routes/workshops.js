const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workshop = require('../models/workshop');
const RegW = require('../models/workshopRegistration');
const PastW = require('../models/pastWorkshop');
const pastWorkshop = require('../models/pastWorkshop');


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

// POST past workshops

router.post('/past', async (req, res) => {
  try {
    const workshop = new pastWorkshop(req.body);
    await workshop.save();
    res.status(201).json(workshop);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// GET past workshops
router.get('/past', async (req, res) => {
  const past = await PastW.find();
  res.json(past);
});

router.get('/past/:id', async (req, res) => {
  const past = await PastW.findById(req.params.id);
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

// Update a workshop
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!workshop) {
      return res.status(404).json({ msg: 'Workshop not found' });
    }
    res.json(workshop);
  } catch (err) {
    console.error('Workshop update error:', err.message);
    res.status(400).json({ msg: 'Invalid data or update failed' });
  }
});

// Delete a workshop (and its registrations)
router.delete('/:id', auth, async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) {
      return res.status(404).json({ msg: 'Workshop not found' });
    }
    await RegW.deleteMany({ workshopId: req.params.id });
    res.json({ msg: 'Workshop deleted' });
  } catch (err) {
    console.error('Workshop delete error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a past workshop record
router.put('/past/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const past = await PastWorkshop.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!past) {
      return res.status(404).json({ msg: 'Past workshop not found' });
    }
    res.json(past);
  } catch (err) {
    console.error('Past workshop update error:', err.message);
    res.status(400).json({ msg: 'Invalid data or update failed' });
  }
});

// Delete a past workshop record
router.delete('/past/:id', auth, async (req, res) => {
  try {
    const past = await PastWorkshop.findByIdAndDelete(req.params.id);
    if (!past) {
      return res.status(404).json({ msg: 'Past workshop not found' });
    }
    res.json({ msg: 'Past workshop deleted' });
  } catch (err) {
    console.error('Past workshop delete error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;