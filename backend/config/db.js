const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Tentukan URL Database:
    // Jika jalan di Docker, dia akan pakai process.env.MONGO_URI (mongodb://mongo:27017/pmate_db)
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pmate_db');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Matikan server jika gagal konek DB
  }
};

module.exports = connectDB;