const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@waterutility.com' });
    console.log('🗑️  Deleted old admin (if existed)');

    // Create new admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@waterutility.com',
      password: 'admin123',  // Will be hashed automatically
      role: 'admin',
      phoneNumber: '+1234567890',
      employeeId: 'EMP001',
      department: 'Administration',
      isActive: true
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('\n🎉 You can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();