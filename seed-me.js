const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Validating admin user...');

    let admin = await User.findOne({ email: 'admin@fashion.com' });
    if (!admin) {
        console.log('Creating admin user...');
        admin = await User.create({
            name: 'Admin User',
            email: 'admin@fashion.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin user created.');
    } else {
        console.log('Admin user already exists.');
        // Update password just in case
        admin.password = 'admin123';
        await admin.save();
        console.log('Admin password updated to admin123');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
