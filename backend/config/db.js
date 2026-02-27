const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.MONGO_URI.startsWith('mongodb')) {
      throw new Error('Invalid or missing MONGO_URI. Skipping database connection.');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error. Starting without DB for UI dummy testing.`);
    console.error(`Error details: ${error.message}`);
    // process.exit(1);
  }
};

module.exports = connectDB;
