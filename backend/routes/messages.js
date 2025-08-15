// backend/routes/messages.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/messages
router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, us.name as sender_name, ur.name as receiver_name
      FROM messages m
      JOIN users us ON m.sender_id = us.id
      JOIN users ur ON m.receiver_id = ur.id
      WHERE m.receiver_id = \$1 OR m.sender_id = \$1
      ORDER BY m.sent_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/messages
router.post('/', protect, async (req, res) => {
  const { receiver_id, subject, body } = req.body;
  const sender_id = req.user.id;

  try {
    await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, subject, body)
       VALUES (\$1, \$2, \$3, \$4)`,
      [sender_id, receiver_id, subject, body]
    );
    res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

export default router;