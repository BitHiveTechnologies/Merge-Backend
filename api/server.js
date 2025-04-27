require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const serverless = require('serverless-http'); // 👉 important for Vercel

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/courses', require('../routes/courses'));
app.use('/api/hackathons', require('../routes/hackathons'));
app.use('/api/workshops', require('../routes/workshops'));
app.use('/api/user', require('../routes/user'));

// ❌ Remove app.listen(PORT)
// ✅ Export the app as a serverless handler
module.exports.handler = serverless(app);
