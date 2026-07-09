require('dotenv').config();
const connectDB = require('../config/database');
const Table = require('../models/Table');

const seedTables = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing tables...');
    await Table.deleteMany({});

    const tablesToSeed = [
      // 2 tables with Capacity 2
      { tableNumber: 1, capacity: 2, isActive: true },
      { tableNumber: 2, capacity: 2, isActive: true },
      // 3 tables with Capacity 4
      { tableNumber: 3, capacity: 4, isActive: true },
      { tableNumber: 4, capacity: 4, isActive: true },
      { tableNumber: 5, capacity: 4, isActive: true },
      // 2 tables with Capacity 6
      { tableNumber: 6, capacity: 6, isActive: true },
      { tableNumber: 7, capacity: 6, isActive: true },
      // 1 table with Capacity 8
      { tableNumber: 8, capacity: 8, isActive: true },
    ];

    console.log('Seeding tables...');
    await Table.insertMany(tablesToSeed);
    console.log('Tables seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding tables: ${error.message}`);
    process.exit(1);
  }
};

seedTables();
