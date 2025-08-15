// backend/routes/fees.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET /api/fees/student/:studentId
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fees WHERE student_id = \$1 ORDER BY due_date',
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/fees - Create fee invoice
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { student_id, amount, due_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO fees (student_id, amount, due_date) VALUES (\$1, \$2, \$3) RETURNING *`,
      [student_id, amount, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating fee', error: err.message });
  }
});

// POST /api/fees/pay
router.post('/pay', protect, authorize('parent', 'admin'), async (req, res) => {
  const { fee_id, payment_method_id } = req.body;

  try {
    const feeResult = await pool.query('SELECT * FROM fees WHERE id = \$1', [fee_id]);
    const fee = feeResult.rows[0];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fee.amount * 100),
      currency: 'usd',
      payment_method: payment_method_id,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      await pool.query(
        `UPDATE fees SET status = 'paid', paid_date = NOW(), receipt_number = \$1 WHERE id = $2`,
        [paymentIntent.id, fee_id]
      );
      res.json({ success: true, receipt: paymentIntent.id });
    }
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
});

export default router;