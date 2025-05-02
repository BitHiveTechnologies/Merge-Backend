const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hackathon = require('../models/hackathon');
const Reg = require('../models/hackathonRegistration');

router.post('/', async (req, res) => {
  try {
    const hackathon = new Hackathon(req.body);
    await hackathon.save();
    res.status(201).json(hackathon);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Invalid data' });
  }
});


// GET all hackathons
router.get('/', async (req, res) => {
  const list = await Hackathon.find();
  res.json(list);
});

// GET winners
router.get('/winners', async (req, res) => {
  // placeholder: filter by some winners flag
  const winners = await Reg.find({}).populate('hackathonId');
  res.json(winners);
});

// GET by ID
router.get('/:id', async (req, res) => {
  const hack = await Hackathon.findById(req.params.id);
  res.json(hack);
});
// POST register
router.post('/register/:id', auth, async (req, res) => {
  const { teamName, teamSize, track } = req.body;
  const exists = await Reg.findOne({ userId: req.user.id, hackathonId: req.params.id });
  if (exists) return res.status(400).json({ msg: 'Already registered' });
  const reg = new Reg({ userId: req.user.id, hackathonId: req.params.id, teamName, teamSize, track });
  await reg.save();
  res.json(reg);
});

// Update a hackathon
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const hackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!hackathon) {
      return res.status(404).json({ msg: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (err) {
    console.error('Hackathon update error:', err.message);
    res.status(400).json({ msg: 'Invalid data or update failed' });
  }
});

// Delete a hackathon (and its registrations)
router.delete('/:id', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ msg: 'Hackathon not found' });
    }
    await Reg.deleteMany({ hackathonId: req.params.id });
    res.json({ msg: 'Hackathon deleted' });
  } catch (err) {
    console.error('Hackathon delete error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

