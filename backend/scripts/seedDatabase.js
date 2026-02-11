const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Asset = require('../models/Asset');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Asset.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    
    const salt = await bcrypt.genSalt(10);
    
    const users = await User.create([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@waterutility.com',
        password: await bcrypt.hash('admin123', salt),
        role: 'admin',
        phoneNumber: '+1234567890',
        employeeId: 'EMP001',
        department: 'Administration',
        isActive: true
      },
      {
        firstName: 'John',
        lastName: 'Supervisor',
        email: 'supervisor@waterutility.com',
        password: await bcrypt.hash('super123', salt),
        role: 'supervisor',
        phoneNumber: '+1234567891',
        employeeId: 'EMP002',
        department: 'Operations',
        isActive: true
      },
      {
        firstName: 'Mike',
        lastName: 'Technician',
        email: 'tech@waterutility.com',
        password: await bcrypt.hash('tech123', salt),
        role: 'technician',
        phoneNumber: '+1234567892',
        employeeId: 'EMP003',
        department: 'Maintenance',
        isActive: true
      },
      {
        firstName: 'Sarah',
        lastName: 'Reader',
        email: 'reader@waterutility.com',
        password: await bcrypt.hash('reader123', salt),
        role: 'meter_reader',
        phoneNumber: '+1234567893',
        employeeId: 'EMP004',
        department: 'Operations',
        isActive: true
      },
      {
        firstName: 'Emily',
        lastName: 'Service',
        email: 'service@waterutility.com',
        password: await bcrypt.hash('service123', salt),
        role: 'customer_service',
        phoneNumber: '+1234567894',
        employeeId: 'EMP005',
        department: 'Customer Service',
        isActive: true
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample complaints
    console.log('📝 Creating sample complaints...');
    
    const complaints = await Complaint.create([
      {
        customerName: 'Robert Johnson',
        customerPhone: '+1234567800',
        customerEmail: 'robert@email.com',
        accountNumber: 'ACC001',
        address: {
          street: '123 Main Street',
          area: 'Downtown',
          zone: 'Zone A',
          city: 'Metro City'
        },
        complaintType: 'Water Leak',
        priority: 'High',
        description: 'Major water leak on the main street causing flooding',
        status: 'Pending',
        createdBy: users[4]._id
      },
      {
        customerName: 'Mary Smith',
        customerPhone: '+1234567801',
        customerEmail: 'mary@email.com',
        accountNumber: 'ACC002',
        address: {
          street: '456 Oak Avenue',
          area: 'Suburbs',
          zone: 'Zone B',
          city: 'Metro City'
        },
        complaintType: 'No Water Supply',
        priority: 'Critical',
        description: 'No water supply for the past 24 hours',
        status: 'Assigned',
        assignedTo: users[2]._id,
        assignedDate: new Date(),
        createdBy: users[4]._id
      },
      {
        customerName: 'David Williams',
        customerPhone: '+1234567802',
        accountNumber: 'ACC003',
        address: {
          street: '789 Pine Road',
          area: 'Industrial',
          zone: 'Zone C',
          city: 'Metro City'
        },
        complaintType: 'Low Water Pressure',
        priority: 'Medium',
        description: 'Water pressure is very low during peak hours',
        status: 'Resolved',
        assignedTo: users[2]._id,
        assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        resolvedDate: new Date(),
        resolvedBy: users[2]._id,
        resolutionNotes: 'Fixed pressure valve. Pressure restored to normal.',
        createdBy: users[4]._id
      },
      {
        customerName: 'Lisa Anderson',
        customerPhone: '+1234567803',
        accountNumber: 'ACC004',
        address: {
          street: '321 Elm Street',
          area: 'Residential',
          zone: 'Zone A',
          city: 'Metro City'
        },
        complaintType: 'Meter Issue',
        priority: 'Low',
        description: 'Water meter not displaying readings correctly',
        status: 'Pending',
        createdBy: users[4]._id
      },
      {
        customerName: 'James Brown',
        customerPhone: '+1234567804',
        accountNumber: 'ACC005',
        address: {
          street: '654 Maple Drive',
          area: 'Commercial',
          zone: 'Zone B',
          city: 'Metro City'
        },
        complaintType: 'Burst Pipe',
        priority: 'Critical',
        description: 'Burst pipe near commercial building',
        status: 'In Progress',
        assignedTo: users[2]._id,
        assignedDate: new Date(),
        createdBy: users[4]._id
      }
    ]);

    console.log(`✅ Created ${complaints.length} sample complaints`);

    // Create sample assets
    console.log('📦 Creating sample assets...');
    
    const assets = await Asset.create([
      {
        assetName: 'Main Water Pump #1',
        assetType: 'Pump',
        category: 'Production',
        manufacturer: 'HydroTech Industries',
        model: 'HT-5000',
        serialNumber: 'HT5000-001',
        purchaseDate: new Date('2020-01-15'),
        installationDate: new Date('2020-02-01'),
        purchaseCost: 50000,
        status: 'Operational',
        condition: 'Good',
        location: {
          facility: 'Main Plant',
          area: 'Pump Station',
          zone: 'Zone A'
        },
        specifications: {
          capacity: '5000 GPM',
          power: '75 HP',
          pressure: '150 PSI'
        },
        maintenanceSchedule: {
          frequency: 'Monthly',
          lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          nextMaintenance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        createdBy: users[0]._id
      },
      {
        assetName: 'Storage Tank - North',
        assetType: 'Tank',
        category: 'Storage',
        manufacturer: 'AquaStore Corp',
        model: 'AS-1000',
        serialNumber: 'AS1000-N01',
        purchaseDate: new Date('2019-06-10'),
        installationDate: new Date('2019-07-01'),
        purchaseCost: 120000,
        status: 'Operational',
        condition: 'Excellent',
        location: {
          facility: 'North Station',
          area: 'Storage Facility',
          zone: 'Zone B'
        },
        specifications: {
          capacity: '1,000,000 gallons',
          other: { material: 'Stainless Steel', height: '50 feet' }
        },
        maintenanceSchedule: {
          frequency: 'Quarterly',
          lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        createdBy: users[0]._id
      },
      {
        assetName: 'Treatment Unit - Primary',
        assetType: 'Treatment Plant',
        category: 'Treatment',
        manufacturer: 'PureTech Systems',
        model: 'PT-3000',
        purchaseDate: new Date('2021-03-20'),
        installationDate: new Date('2021-05-15'),
        purchaseCost: 250000,
        status: 'Operational',
        condition: 'Good',
        location: {
          facility: 'Main Plant',
          area: 'Treatment Section',
          zone: 'Zone A'
        },
        specifications: {
          capacity: '10 MGD',
          other: { processes: 'Filtration, Chlorination, UV' }
        },
        maintenanceSchedule: {
          frequency: 'Weekly',
          lastMaintenance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          nextMaintenance: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        createdBy: users[0]._id
      },
      {
        assetName: 'Service Vehicle #3',
        assetType: 'Vehicle',
        category: 'Transport',
        manufacturer: 'Ford',
        model: 'F-150',
        serialNumber: 'FRD-F150-003',
        purchaseDate: new Date('2022-01-10'),
        status: 'Operational',
        condition: 'Good',
        location: {
          facility: 'Main Office',
          area: 'Fleet Garage'
        },
        assignedTo: users[2]._id,
        createdBy: users[0]._id
      },
      {
        assetName: 'Backup Generator',
        assetType: 'Generator',
        category: 'Production',
        manufacturer: 'PowerGen Inc',
        model: 'PG-500',
        serialNumber: 'PG500-BK01',
        purchaseDate: new Date('2020-08-15'),
        installationDate: new Date('2020-09-01'),
        purchaseCost: 75000,
        status: 'Operational',
        condition: 'Good',
        location: {
          facility: 'Main Plant',
          area: 'Power Room',
          zone: 'Zone A'
        },
        specifications: {
          power: '500 KW',
          other: { fuelType: 'Diesel', runtime: '72 hours' }
        },
        maintenanceSchedule: {
          frequency: 'Monthly',
          lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          nextMaintenance: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        },
        createdBy: users[0]._id
      }
    ]);

    console.log(`✅ Created ${assets.length} sample assets`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@waterutility.com / admin123');
    console.log('Supervisor: supervisor@waterutility.com / super123');
    console.log('Technician: tech@waterutility.com / tech123');
    console.log('Meter Reader: reader@waterutility.com / reader123');
    console.log('Customer Service: service@waterutility.com / service123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
