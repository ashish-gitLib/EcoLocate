const mongoose = require('mongoose');

const recyclingRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    deviceName: {
      type: String,
      required: true,
    },

    deviceCategory: {
      type: String,
    },

    brand: {
      type: String,
      default: 'Unknown',
    },

    model: {
      type: String,
      default: 'Unknown',
    },

    condition: {
      type: String,
    },

    imageUri: {
      type: String,
    },

    facilityId: {
      type: String,
      required: true,
    },

    facilityName: {
      type: String,
      required: true,
    },

    facilityLatitude: {
  type: Number,
},

facilityLongitude: {
  type: Number,
},

    estimatedEcoCoins: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'recycled', 'rejected'],
      default: 'pending',
    },

    pickupRequested: {
  type: Boolean,
  default: false,
},

pickupAddress: {
  type: String,
},

pickupDate: {
  type: String,
},

pickupPhoneNumber: {
  type: String,
},

pickupInstructions: {
  type: String,
},

pickupStatus: {
  type: String,
  enum: [
    'not_requested',
    'requested',
    'scheduled',
    'completed',
    'rejected',
  ],
  default: 'not_requested',
},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  'RecyclingRequest',
  recyclingRequestSchema,
);