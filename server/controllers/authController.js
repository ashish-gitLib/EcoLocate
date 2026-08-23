const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
  try {

    const {
      username,
      email,
      password,
      role,
    } = req.body;


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }


    // --------------------------------------------------
    // CHECK IF USER ALREADY EXISTS
    // --------------------------------------------------

    const existingUser =
      await User.findOne({
        $or: [
          {email},
          {username},
        ],
      });


    if (existingUser) {
      return res.status(409).json({
        message:
          'Username or email already exists',
      });
    }


    // --------------------------------------------------
    // PASSWORD HASHING
    // --------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10,
      );


    // --------------------------------------------------
    // ROLE ASSIGNMENT
    //
    // ADMIN can NEVER be created through public register
    // --------------------------------------------------

    let userRole = 'USER';


    if (role === 'PROVIDER') {
      userRole = 'PROVIDER';
    }


    // --------------------------------------------------
    // CREATE USER
    // --------------------------------------------------

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,
    });


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(201).json({
      message:
        'Account created successfully',

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });


  } catch (error) {

    console.log(
      'Register error:',
      error.message,
    );


    res.status(500).json({
      message: 'Server error',
    });

  }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        message:
          'Email and password are required',
      });
    }


    // --------------------------------------------------
    // FIND USER
    // --------------------------------------------------

    const user =
      await User.findOne({
        email,
      });


    if (!user) {
      return res.status(401).json({
        message:
          'Invalid email or password',
      });
    }


    // --------------------------------------------------
    // VERIFY PASSWORD
    // --------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password,
      );


    if (!passwordMatch) {
      return res.status(401).json({
        message:
          'Invalid email or password',
      });
    }


    // --------------------------------------------------
    // CREATE JWT TOKEN
    // --------------------------------------------------

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      },
    );


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.json({
      message: 'Login successful',

      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });


  } catch (error) {

    console.log(
      'Login error:',
      error.message,
    );


    res.status(500).json({
      message: 'Server error',
    });

  }
};

// ======================================================
// GET MY PROFILE
// ======================================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId,
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(
      'Get profile error:',
      error.message,
    );

    return res.status(500).json({
      message: 'Unable to fetch profile',
    });
  }
};

// ======================================================
// UPDATE MY PROFILE
// ======================================================

const updateProfile = async (req, res) => {
  try {
    const {username} = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        message: 'Username is required',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        username: username.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

  } catch (error) {
    console.log(
      'Update profile error:',
      error.message,
    );

    // Username is already taken
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Username already exists',
      });
    }

    return res.status(500).json({
      message: 'Unable to update profile',
    });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};