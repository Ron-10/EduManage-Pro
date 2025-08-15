// backend/routes/attendance.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/attendance/:studentId?date=2025-04-05
router.get('/:studentId', protect, async (req, res) => {
  const { studentId } = req.params;
  const { date } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE student_id = \$1 AND date = \$2',
      [studentId, date || new Date().toISOString().split('T')[0]]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/attendance
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  const { student_id, date, status } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO attendance (student_id, date, status)
      VALUES (\$1, \$2, \$3)
      ON CONFLICT (student_id, date) DO UPDATE
      SET status = EXCLUDED.status
      RETURNING *
    `, [student_id, date, status]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error recording attendance', error: err.message });
  }
});

export default router;