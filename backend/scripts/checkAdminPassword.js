const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function checkAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found');
      return;
    }

    console.log('👤 Admin user found:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Password Hash: ${adminUser.password}`);

    // Test common passwords
    const commonPasswords = [
      'admin123',
      'password123', 
      'admin',
      'password',
      'demo123',
      '123456',
      'admin@123',
      'fashion123'
    ];

    console.log('\\n🔍 Testing common passwords...');
    
    for (const password of commonPasswords) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
        console.log(`\\n🎉 FOUND! Admin password is: ${password}`);
        console.log('\\n🔑 Admin Login Credentials:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: ${password}`);
        break;
      } else {
        console.log(`   ❌ Not: ${password}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\\n🔌 Database connection closed');
  }
}

// Run the check
checkAdminPassword();