const mongoose = require('mongoose');

const meterReadingSchema = new mongoose.Schema({
  meterNumber: {
    type: String,
    required: [true, 'Meter number is required'],
    index: true
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    index: true
  },
  customerName: {
    type: String,
    required: true
  },
  address: {
    street: String,
    area: String,
    zone: String,
    city: String
  },
  previousReading: {
    type: Number,
    default: 0
  },
  currentReading: {
    type: Number,
    required: [true, 'Current reading is required']
  },
  consumption: {
    type: Number // calculated: currentReading - previousReading
  },
  readingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  billingPeriod: {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  meterType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Government'],
    default: 'Residential'
  },
  meterStatus: {
    type: String,
    enum: ['Normal', 'Faulty', 'Stuck', 'Reversed', 'Tampered'],
    default: 'Normal'
  },
  readingMethod: {
    type: String,
    enum: ['Manual', 'Photo', 'Smart Meter'],
    default: 'Manual'
  },
  meterImage: {
    url: String,
    publicId: String
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gpsLocation: {
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
  notes: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedDate: {
    type: Date
  },
  anomalyDetected: {
    type: Boolean,
    default: false
  },
  anomalyReason: {
    type: String,
    enum: ['High Consumption', 'Zero Consumption', 'Negative Reading', 'Meter Reversed', 'Other']
  }
}, {
  timestamps: true
});

// Calculate consumption before saving
meterReadingSchema.pre('save', function(next) {
  if (this.currentReading !== undefined && this.previousReading !== undefined) {
    this.consumption = this.currentReading - this.previousReading;
    
    // Detect anomalies
    if (this.consumption < 0) {
      this.anomalyDetected = true;
      this.anomalyReason = 'Negative Reading';
    } else if (this.consumption === 0) {
      this.anomalyDetected = true;
      this.anomalyReason = 'Zero Consumption';
    } else if (this.consumption > 1000) {
      this.anomalyDetected = true;
      this.anomalyReason = 'High Consumption';
    }
  }
  next();
});

// Index for efficient querying
meterReadingSchema.index({ billingPeriod: 1, meterNumber: 1 });
meterReadingSchema.index({ readingDate: -1 });

module.exports = mongoose.model('MeterReading', meterReadingSchema);
