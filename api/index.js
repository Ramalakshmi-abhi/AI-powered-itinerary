require('dotenv').config();
const dns = require('dns');

// Fix Node.js DNS SRV resolution issues for mongodb+srv connection strings on Windows
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('⚠️ DNS setServers failed, ignoring:', err.message);
  }
}

// Import app from the server directory
const app = require('../server/src/app');

module.exports = app;
