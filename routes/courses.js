const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');

router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Invalid data' });
  }
});

// GET all courses (filter by level, price)
router.get('/', async (req, res) => {
  const { level, price } = req.query;
  const filter = {};
  if (level) filter.level = level;
  if (price) filter.price = Number(price);
  const courses = await Course.find(filter);
  res.json(courses);
});

// GET enrolled courses for user
router.get('/enrolled', auth, async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
  res.json(enrollments);
});

// GET only featured courses
router.get('/featured', async (req, res) => {
  const featured = await Course.find({ isFeatured: true });
  res.json(featured);
});

// GET course by ID
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});

// POST enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  const exists = await Enrollment.findOne({ userId: req.user.id, courseId: req.params.id });
  if (exists) return res.status(400).json({ msg: 'Already enrolled' });
  const enrollment = new Enrollment({ userId: req.user.id, courseId: req.params.id });
  await enrollment.save();
  res.json(enrollment);
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error('Course update error:', err.message);
    res.status(400).json({ msg: 'Invalid data or update failed' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    // Optionally, clean up related enrollments:
    await Enrollment.deleteMany({ courseId: req.params.id });
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    console.error('Course delete error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
