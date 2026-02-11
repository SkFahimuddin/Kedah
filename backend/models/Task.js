const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Task description is required']
  },
  taskType: {
    type: String,
    required: true,
    enum: [
      'Field Visit',
      'Inspection',
      'Repair',
      'Installation',
      'Meter Reading',
      'Customer Visit',
      'Administrative',
      'Training',
      'Survey',
      'Other'
    ]
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Pending'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  estimatedDuration: {
    type: Number // in hours
  },
  actualDuration: {
    type: Number // in hours
  },
  location: {
    address: String,
    area: String,
    zone: String,
    gpsCoordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['Complaint', 'Asset', 'Maintenance', 'MeterReading', 'None'],
      default: 'None'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.entityType'
    }
  },
  checklist: [{
    item: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  materials: [{
    name: String,
    quantity: Number,
    unit: String
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completionNotes: {
    type: String
  },
  attachments: [{
    url: String,
    publicId: String,
    fileName: String,
    uploadDate: Date
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isOverdue: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate task ID before saving
taskSchema.pre('save', async function(next) {
  if (!this.taskId) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.taskId = `TSK-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate actual duration if completed
  if (this.completionDate && this.startDate) {
    this.actualDuration = Math.round((this.completionDate - this.startDate) / (1000 * 60 * 60));
  }
  
  // Check if overdue
  if (this.status !== 'Completed' && this.status !== 'Cancelled' && new Date() > this.dueDate) {
    this.isOverdue = true;
  }
  
  next();
});

module.exports = mongoose.model('Task', taskSchema);
