const crypto = require('crypto');

/**
 * Generate a unique 6-character alphanumeric share code
 * @returns {string} 6-character alphanumeric code
 */
const generateShareCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
};

module.exports = { generateShareCode };
