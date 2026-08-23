const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // USER = Consumer app user
    // PROVIDER = Facility provider
    // ADMIN = Administrator
    role: {
      type: String,
      enum: [
        'USER',
        'PROVIDER',
        'ADMIN',
      ],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  },
);

const User =
  mongoose.model(
    'User',
    userSchema,
  );

module.exports = User;