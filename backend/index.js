import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; // Named export
import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';
import feeRoutes from './routes/fees.js';
import examRoutes from './routes/exams.js';
import timetableRoutes from './routes/timetable.js';
import libraryRoutes from './routes/library.js';
import messageRoutes from './routes/messages.js';

dotenv.config();

// Connect to DB
connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/messages', messageRoutes);

console.log('✅ Auth routes mounted on /api/auth');
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EduManage Pro Server running on port ${PORT}`);
});

import authRoutes from './routes/auth.js'; // Must have .js
app.use('/api/auth', authRoutes);