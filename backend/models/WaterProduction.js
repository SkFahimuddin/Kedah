const mongoose = require('mongoose');

const waterProductionSchema = new mongoose.Schema({
  productionDate: {
    type: Date,
    required: [true, 'Production date is required'],
    index: true
  },
  facility: {
    type: String,
    required: [true, 'Facility name is required'],
    enum: ['Main Plant', 'North Station', 'South Station', 'East Pump Station', 'West Treatment Plant']
  },
  shift: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Night'],
    required: true
  },
  production: {
    volumeProduced: {
      type: Number,
      required: [true, 'Production volume is required']
    },
    unit: {
      type: String,
      enum: ['m³', 'gallons', 'liters'],
      default: 'm³'
    }
  },
  rawWaterSource: {
    type: String,
    enum: ['River', 'Borehole', 'Dam', 'Lake', 'Mixed']
  },
  waterQuality: {
    pH: {
      type: Number,
      min: 0,
      max: 14
    },
    turbidity: {
      value: Number,
      unit: {
        type: String,
        default: 'NTU'
      }
    },
    chlorine: {
      value: Number,
      unit: {
        type: String,
        default: 'mg/L'
      }
    },
    totalDissolvedSolids: {
      value: Number,
      unit: {
        type: String,
        default: 'mg/L'
      }
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        default: '°C'
      }
    }
  },
  chemicalsUsed: [{
    name: String,
    quantity: Number,
    unit: String,
    cost: Number
  }],
  energyConsumption: {
    electricity: {
      value: Number,
      unit: {
        type: String,
        default: 'kWh'
      },
      cost: Number
    },
    fuel: {
      value: Number,
      unit: {
        type: String,
        default: 'liters'
      },
      cost: Number
    }
  },
  distribution: {
    volumeDistributed: Number,
    nonRevenueWater: Number, // water loss
    percentageLoss: Number
  },
  operationalStatus: {
    pumpsOperating: Number,
    pumpsDown: Number,
    treatmentUnitsOperating: Number,
    issues: String
  },
  staff: [{
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  }],
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  },
  incidents: [{
    time: Date,
    description: String,
    action: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate percentage loss before saving
waterProductionSchema.pre('save', function(next) {
  if (this.distribution.volumeDistributed && this.production.volumeProduced) {
    this.distribution.nonRevenueWater = this.production.volumeProduced - this.distribution.volumeDistributed;
    this.distribution.percentageLoss = (this.distribution.nonRevenueWater / this.production.volumeProduced) * 100;
  }
  next();
});

// Index for efficient reporting
waterProductionSchema.index({ productionDate: -1, facility: 1 });

module.exports = mongoose.model('WaterProduction', waterProductionSchema);
