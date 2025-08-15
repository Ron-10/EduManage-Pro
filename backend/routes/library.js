// backend/routes/library.js
import { Router } from 'express';
import pool from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/library/books
router.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM library_books ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/library/issue
router.post('/issue', protect, authorize('admin', 'librarian'), async (req, res) => {
  const { book_id, student_id, due_date } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bookResult = await client.query('SELECT available_copies FROM library_books WHERE id = \$1 FOR UPDATE', [book_id]);
    if (bookResult.rows[0].available_copies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    await client.query(
      `INSERT INTO issued_books (book_id, student_id, due_date) VALUES (\$1, \$2, \$3)`,
      [book_id, student_id, due_date]
    );

    await client.query(
      'UPDATE library_books SET available_copies = available_copies - 1 WHERE id = \$1',
      [book_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Book issued successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Error issuing book', error: err.message });
  } finally {
    client.release();
  }
});

export default router;