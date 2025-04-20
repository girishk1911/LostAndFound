const mongoose = require('mongoose');
const Guard = require('../models/Guard');
const config = require('../config/config');

// Connect to MongoDB
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// The single guard account to be created
const guardData = {
  username: 'pict_guard',
  password: 'secure@guard123',
  role: 'guard'
};

async function seedGuard() {
  try {
    // First, check if any guard already exists
    const existingGuard = await Guard.findOne({ username: guardData.username });
    
    if (existingGuard) {
      console.log('Guard account already exists.');
      return;
    }
    
    // Create the guard
    const guard = new Guard(guardData);
    await guard.save();
    
    console.log('Guard account created successfully.');
  } catch (error) {
    console.error('Error seeding guard:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Run the seed function
seedGuard(); 