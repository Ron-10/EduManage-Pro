-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert roles
INSERT INTO roles (name) VALUES 
  ('admin'),
  ('teacher'),
  ('student'),
  ('parent'),
  ('librarian')
ON CONFLICT (name) DO NOTHING;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Hash password for admin
-- You can generate it in Node, but here's bcrypt('admin123')
-- $2b$10$VEr2bOaZ8.9IzL9Z0qY5hOqZv7eFpZ6iW.7o2f0yX3jJZ5C5uZ6iW = "admin123"

-- Insert admin user if not exists
INSERT INTO users (name, email, password_hash, role_id)
VALUES (
  'Admin User',
  'admin@school.com',
  '$2b$10$/m8FsPV4wUR91k4F3NLFbugfo0mCMWWpHt2tkfZx13J6xe9xIYqVO',
  (SELECT id FROM roles WHERE name = 'admin')
)
ON CONFLICT (email) DO NOTHING;

-- 4. Classes
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- 5. Students
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  class_id INTEGER REFERENCES classes(id),
  admission_number VARCHAR(20) UNIQUE,
  date_of_birth DATE,
  parent_name VARCHAR(100),
  parent_email VARCHAR(100),
  parent_phone VARCHAR(15),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  date DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late')),
  UNIQUE(student_id, date)
);

-- 7. Fees
CREATE TABLE IF NOT EXISTS fees (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_date DATE,
  receipt_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Done