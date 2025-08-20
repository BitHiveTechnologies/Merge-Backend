const mongoose = require('mongoose');
const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  duration: String
});
const SectionSchema = new mongoose.Schema({
  title: String,
  lessons: [LessonSchema]
});
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  instructorImg: String,
  duration: String,
  level: String,
  rating: Number,
  price: Number,
  image: String,
  isFeatured: Boolean,
  curriculum: [SectionSchema]
});
module.exports = mongoose.model('Course', CourseSchema);