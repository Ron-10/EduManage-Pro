// backend/routes/exams.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/exams/subject/:subjectId
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exams WHERE subject_id = \$1', [req.params.subjectId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/exams
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  const { subject_id, name, date, max_marks } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO exams (subject_id, name, date, max_marks) VALUES (\$1, \$2, \$3, \$4) RETURNING *`,
      [subject_id, name, date, max_marks]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating exam', error: err.message });
  }
});

export default router;