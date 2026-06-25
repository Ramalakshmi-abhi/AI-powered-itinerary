const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<void>}
 */
const connectDB = async (retries = 5) => {
  const isServerless = !!process.env.VERCEL;
  const maxRetries = isServerless ? 1 : retries;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not defined.');
      }

      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      return;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error('💀 All MongoDB connection attempts exhausted.');
        if (isServerless) {
          throw error;
        } else {
          process.exit(1);
        }
      }
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
