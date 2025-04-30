// routes/payments.js
const express  = require('express');
const crypto   = require('crypto');
const auth     = require('../middleware/auth');
const razorpay = require('../config/razorpay');
const Enrollment = require('../models/enrollment');  // Or your WorkshopRegistration model

const router = express.Router();

/**
 * @route   POST /api/payments/order
 * @desc    Create a Razorpay order
 * @access  Private
 */
router.post('/order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const opts = {
      amount: amount * 100,         // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };
    const order = await razorpay.orders.create(opts);
    res.json(order);
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    res.status(500).json({ msg: 'Order creation failed' });
  }
});

/**
 * @route   POST /api/payments/verify
 * @desc    Verify payment signature & record enrollment
 * @access  Private
 */
router.post('/verify', auth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId        // front-end must include the course/workshop ID
  } = req.body;

  // 1) Verify signature
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const expected = hmac.digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ msg: 'Invalid signature' });
  }

  // 2) Record enrollment (or workshop registration)
  try {
    const enrollment = new Enrollment({
      userId:        req.user.id,
      courseId,                     // or workshopId
      enrollmentDate: Date.now(),
      status:        'paid',
      paymentId:     razorpay_payment_id
    });
    await enrollment.save();
    res.json({ msg: 'Payment verified and enrollment saved' });
  } catch (err) {
    console.error('Enrollment Save Error:', err);
    res.status(500).json({ msg: 'Enrollment save failed' });
  }
});

module.exports = router;
