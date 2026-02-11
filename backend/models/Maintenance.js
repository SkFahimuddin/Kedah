const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  maintenanceId: {
    type: String,
    unique: true,
    required: true
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset is required']
  },
  maintenanceType: {
    type: String,
    required: true,
    enum: ['Preventive', 'Corrective', 'Emergency', 'Routine', 'Inspection']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  title: {
    type: String,
    required: [true, 'Maintenance title is required']
  },
  description: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue'],
    default: 'Scheduled'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workDetails: {
    activitiesPerformed: String,
    partsReplaced: [{
      partName: String,
      quantity: Number,
      cost: Number
    }],
    laborHours: Number,
    totalCost: Number
  },
  beforeCondition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical']
  },
  afterCondition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical']
  },
  photos: [{
    url: String,
    publicId: String,
    caption: String,
    uploadDate: Date
  }],
  notes: {
    type: String
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  downtime: {
    type: Number // in hours
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate maintenance ID before saving
maintenanceSchema.pre('save', async function(next) {
  if (!this.maintenanceId) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.maintenanceId = `MNT-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate downtime if completed
  if (this.completionDate && this.startDate) {
    this.downtime = Math.round((this.completionDate - this.startDate) / (1000 * 60 * 60));
  }
  
  // Check if overdue
  if (this.status === 'Scheduled' && new Date() > this.scheduledDate) {
    this.status = 'Overdue';
  }
  
  next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
