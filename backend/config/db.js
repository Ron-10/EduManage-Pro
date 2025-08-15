import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/school_db'
});

// Optional: Log connection
pool.on('connect', () => {
  console.log('PostgreSQL connected');
});

// Export the pool (used for queries)
export default pool;

// If you want a connectDB function, export it like this:
export const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');
  } catch (err) {
    console.error('Database connection failed', err.stack);
    process.exit(1); // Exit app if DB fails
  }
};