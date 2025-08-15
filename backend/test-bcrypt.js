import bcrypt from 'bcrypt';

const password = 'admin123';
const hash = '$2b$10$VEr2bOaZ8.9IzL9Z0qY5hOqZv7eFpZ6iW.7o2f0yX3jJZ5C5uZ6iW';

const checkPassword = async () => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password match:', isMatch); // This should print true
  } catch (err) {
    console.error('Error during bcrypt comparison:', err);
  }
};

checkPassword();