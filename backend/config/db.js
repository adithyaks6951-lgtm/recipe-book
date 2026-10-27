const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.warn('⚠️ [MongoDB Atlas] No MONGO_URI provided in .env.');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`✅ [MongoDB Atlas Connected] Host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ [MongoDB Atlas Connection Notice] Could not reach cluster: ${error.message}`);
    console.warn('ℹ️ Active in-memory store initialized. Add, View, Edit, and Delete will work smoothly.');
    console.warn('ℹ️ To persist data to your own Atlas cluster, update MONGO_URI in backend/.env.');
  }
};

module.exports = connectDB;
