require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB();

    console.log('Checking if admin exists...');
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists, updating role to admin...');
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin updated successfully.');
      process.exit(0);
    }

    console.log('Creating admin user...');
    await User.create({
      name: 'Restaurant Administrator',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Admin account seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
