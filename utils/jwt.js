const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  if (typeof password !== 'string') {
    throw new Error(`Password must be a string, got ${typeof password}`);
  }
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = hashPassword;
