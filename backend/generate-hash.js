import bcrypt from 'bcrypt';

const passwordToHash = 'admin123';
const saltRounds = 10; // Standard number of salt rounds

const generateHash = async () => {
  try {
    const hash = await bcrypt.hash(passwordToHash, saltRounds);
    console.log('--- Copy this new hash ---');
    console.log(hash);
    console.log('--------------------------');
  } catch (err) {
    console.error('Error generating hash:', err);
  }
};

generateHash();