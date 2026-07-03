const mongoose = require("mongoose");
const config=require('../config/config');

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("DB connected");
  } catch (err) {
    console.log("DB connection error" + err);
  }
}

module.exports = connectDB;
