const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    providerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
},

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    openingHours: {
      type: String,
      default: '9:00 AM - 6:00 PM',
    },

    acceptedDevices: {
      type: [String],
      default: [],
    },

    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  'Facility',
  facilitySchema,
);