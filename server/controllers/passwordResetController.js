const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// ===============================
// SEND OTP
// ===============================

const forgotPassword = async (req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether an email exists.
    if (!user) {
      return res.json({
        message:
          'If an account exists with this email, an OTP has been sent.',
      });
    }

    // Remove any previous OTP
    await PasswordReset.deleteMany({
      email: normalizedEmail,
    });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before storing
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expires after 5 minutes
    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000,
    );

    await PasswordReset.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
    });

    // Send OTP email
    // Send OTP email using Gmail
await transporter.sendMail({
  from: `"EcoLocate" <${process.env.EMAIL_USER}>`,

  to: normalizedEmail,

  subject: 'EcoLocate Password Reset OTP',

  html: `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 500px;
      margin: auto;
      padding: 20px;
    ">

      <h2>♻️ EcoLocate Password Reset</h2>

      <p>Hello,</p>

      <p>
        We received a request to reset your EcoLocate password.
      </p>

      <p>Your password reset OTP is:</p>

      <h1 style="
        letter-spacing: 8px;
        text-align: center;
        padding: 15px;
      ">
        ${otp}
      </h1>

      <p>
        This OTP will expire in <strong>5 minutes</strong>.
      </p>

      <p>
        If you did not request a password reset,
        you can safely ignore this email.
      </p>

      <br />

      <p>
        — EcoLocate Team ♻️
      </p>

    </div>
  `,
});

    res.json({
      message:
        'If an account exists with this email, an OTP has been sent.',
    });

 } catch (error) {
  console.log(
    'Forgot password error:',
    error.message,
  );

  res.status(500).json({
    message: 'Unable to send OTP. Please try again.',
  });
}
};


// ===============================
// VERIFY OTP
// ===============================

const verifyOTP = async (req, res) => {
  try {
    const {email, otp} = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const resetRequest = await PasswordReset.findOne({
      email: normalizedEmail,
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: 'OTP has expired',
      });
    }

    // Limit OTP attempts
    if (resetRequest.attempts >= 5) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(429).json({
        message: 'Too many attempts. Request a new OTP.',
      });
    }

    const isValidOTP = await bcrypt.compare(
      otp.toString(),
      resetRequest.otpHash,
    );

    if (!isValidOTP) {
      resetRequest.attempts += 1;

      await resetRequest.save();

      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }

    res.json({
      message: 'OTP verified successfully',
    });

  } catch (error) {
    console.log('Verify OTP error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};


// ===============================
// RESET PASSWORD
// ===============================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message:
          'Email, OTP and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          'Password must be at least 6 characters',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const resetRequest = await PasswordReset.findOne({
      email: normalizedEmail,
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: 'OTP has expired',
      });
    }

    if (resetRequest.attempts >= 5) {
      return res.status(429).json({
        message: 'Too many attempts. Request a new OTP.',
      });
    }

    const isValidOTP = await bcrypt.compare(
      otp.toString(),
      resetRequest.otpHash,
    );

    if (!isValidOTP) {
      resetRequest.attempts += 1;

      await resetRequest.save();

      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Unable to reset password',
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    );

    user.password = hashedPassword;

    await user.save();

    // OTP can no longer be reused
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    });

    res.json({
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.log('Reset password error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};


module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword,
};