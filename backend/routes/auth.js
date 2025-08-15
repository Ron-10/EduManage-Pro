import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email }); // 👈 Debug

  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    console.log('Query result count:', result.rows.length); // 👈 Debug

    if (result.rows.length === 0) {
      console.log('User not found'); // 👈 Debug
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('User found:', { id: user.id, role: user.role }); // 👈 Debug

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', isMatch); // 👈 Debug

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ... rest of JWT and response

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } // In the catch block of login route
    catch (err) {
  console.error('Login error:', err); // ← This will show the real issue
  res.status(500).json({ message: 'Server error' });
}
  }
);

export default router;