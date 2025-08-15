// backend/routes/students.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/students - Get all students (Admin, Teacher)
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.admission_number, s.date_of_birth, s.parent_name, s.parent_email, s.parent_phone,
             u.name, u.email, c.name as class_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/students - Add new student (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { name, email, password, class_id, admission_number, date_of_birth, parent_name, parent_email, parent_phone, address } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role_id)
       VALUES (\$1, \$2, \$3, (SELECT id FROM roles WHERE name = 'student'))
       RETURNING id`,
      [name, email, password_hash]
    );

    const user_id = userResult.rows[0].id;

    await client.query(
      `INSERT INTO students (user_id, class_id, admission_number, date_of_birth, parent_name, parent_email, parent_phone, address)
       VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8)`,
      [user_id, class_id, admission_number, date_of_birth, parent_name, parent_email, parent_phone, address]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Error creating student', error: err.message });
  } finally {
    client.release();
  }
});

export default router;