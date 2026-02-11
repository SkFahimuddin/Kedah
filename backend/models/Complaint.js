const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required']
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required']
  },
  address: {
    street: String,
    area: String,
    zone: String,
    city: String
  },
  complaintType: {
    type: String,
    required: true,
    enum: [
      'Water Leak',
      'No Water Supply',
      'Low Water Pressure',
      'Burst Pipe',
      'Meter Issue',
      'Billing Issue',
      'Water Quality',
      'Illegal Connection',
      'Other'
    ]
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
    default: 'Pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDate: {
    type: Date
  },
  attachments: [{
    url: String,
    publicId: String,
    fileName: String,
    uploadDate: Date
  }],
  resolutionNotes: {
    type: String
  },
  resolvedDate: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responseTime: {
    type: Number // in hours
  },
  resolutionTime: {
    type: Number // in hours
  },
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    feedbackDate: Date
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate complaint ID before saving
complaintSchema.pre('save', async function(next) {
  if (!this.complaintId) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.complaintId = `CMP-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate response time when assigned
complaintSchema.pre('save', function(next) {
  if (this.isModified('assignedDate') && this.assignedDate) {
    this.responseTime = Math.round((this.assignedDate - this.createdAt) / (1000 * 60 * 60));
  }
  
  if (this.isModified('resolvedDate') && this.resolvedDate) {
    this.resolutionTime = Math.round((this.resolvedDate - this.createdAt) / (1000 * 60 * 60));
  }
  
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
