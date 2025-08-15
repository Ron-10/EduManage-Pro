// backend/routes/timetable.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/timetable/class/:classId
router.get('/class/:classId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.day, t.start_time, t.end_time, s.name as subject, u.name as teacher
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.class_id = \$1
      ORDER BY t.day, t.start_time
    `, [req.params.classId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;