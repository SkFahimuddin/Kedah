const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetId: {
    type: String,
    unique: true,
    required: true
  },
  assetName: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true
  },
  assetType: {
    type: String,
    required: true,
    enum: [
      'Pump',
      'Valve',
      'Pipe',
      'Tank',
      'Treatment Plant',
      'Generator',
      'Vehicle',
      'Meter',
      'Filtration Unit',
      'Chlorinator',
      'Pressure Gauge',
      'Other'
    ]
  },
  category: {
    type: String,
    enum: ['Production', 'Distribution', 'Storage', 'Treatment', 'Transport', 'Monitoring'],
    required: true
  },
  manufacturer: {
    type: String
  },
  model: {
    type: String
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  purchaseDate: {
    type: Date
  },
  installationDate: {
    type: Date
  },
  purchaseCost: {
    type: Number
  },
  warrantyExpiry: {
    type: Date
  },
  expectedLifespan: {
    type: Number // in years
  },
  location: {
    facility: String,
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
  status: {
    type: String,
    enum: ['Operational', 'Under Maintenance', 'Out of Service', 'Decommissioned'],
    default: 'Operational'
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
    default: 'Good'
  },
  specifications: {
    capacity: String,
    power: String,
    pressure: String,
    diameter: String,
    length: String,
    other: mongoose.Schema.Types.Mixed
  },
  maintenanceSchedule: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
    },
    lastMaintenance: Date,
    nextMaintenance: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  photos: [{
    url: String,
    publicId: String,
    uploadDate: Date
  }],
  documents: [{
    name: String,
    url: String,
    type: String, // manual, certificate, invoice, etc.
    uploadDate: Date
  }],
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate asset ID before saving
assetSchema.pre('save', async function(next) {
  if (!this.assetId) {
    const count = await this.constructor.countDocuments();
    const prefix = this.assetType.substring(0, 3).toUpperCase();
    this.assetId = `${prefix}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
