const express = require('express');
const router = express.Router();

const Facility = require('../models/Facility');

const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authMiddleware');


// ADD A FACILITY REQUEST
router.post(
  '/',
  authenticateUser,
  authorizeRoles('PROVIDER'),
  async (req, res) => {
  try {
    const facility = new Facility({
  ...req.body,
  providerId: req.user.userId,
});

    await facility.save();

    res.status(201).json({
      message: 'Facility request submitted successfully',
      facility,
    });

  } catch (error) {
    console.log('Add facility error:', error.message);

    res.status(500).json({
      message: 'Unable to submit facility request',
      error: error.message,
    });
  }
});


// APPROVE A FACILITY
router.patch('/:id/approve', async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'APPROVED',
      },
      {
        new: true,
      },
    );

    if (!facility) {
      return res.status(404).json({
        message: 'Facility not found',
      });
    }

    res.status(200).json({
      message: 'Facility approved successfully',
      facility,
    });

  } catch (error) {
    console.log(
      'Approve facility error:',
      error.message,
    );

    res.status(500).json({
      message: 'Unable to approve facility',
      error: error.message,
    });
  }
});

    // REJECT A FACILITY
router.patch('/:id/reject', async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'REJECTED',
      },
      {
        new: true,
      },
    );

    if (!facility) {
      return res.status(404).json({
        message: 'Facility not found',
      });
    }

    res.status(200).json({
      message: 'Facility rejected successfully',
      facility,
    });

  } catch (error) {
    console.log(
      'Reject facility error:',
      error.message,
    );

    res.status(500).json({
      message: 'Unable to reject facility',
      error: error.message,
    });
  }
});

    // GET ALL PENDING FACILITY REQUESTS
router.get('/pending', async (req, res) => {
  try {
    const facilities = await Facility.find({
      verificationStatus: 'PENDING',
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      facilities,
    });

  } catch (error) {
    console.log(
      'Get pending facilities error:',
      error.message,
    );

    res.status(500).json({
      message: 'Unable to fetch pending facilities',
    });
  }
});


// GET APPROVED FACILITIES
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find({
      verificationStatus: 'APPROVED',
    });

    res.status(200).json({
      facilities,
    });

  } catch (error) {
    console.log('Get facilities error:', error.message);

    res.status(500).json({
      message: 'Unable to fetch facilities',
    });
  }
});


module.exports = router;