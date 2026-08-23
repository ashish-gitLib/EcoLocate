const express = require('express');

const router = express.Router();


const {
  createRecyclingRequest,
  getMyRecyclingRequests,
  getProviderRecyclingRequests,
  updateRecyclingRequestStatus,
  requestPickup,
} = require('../controllers/recyclingRequestController');


const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authMiddleware');


// ============================================
// CREATE RECYCLING REQUEST
// ============================================

router.post(
  '/',
  authenticateUser,
  createRecyclingRequest,
);


// ============================================
// GET MY RECYCLING REQUESTS
// ============================================

router.get(
  '/my-requests',
  authenticateUser,
  getMyRecyclingRequests,
);


        // ============================================
// GET PROVIDER'S FACILITY REQUESTS
// ============================================



router.get(
  '/provider-requests',
  authenticateUser,
  authorizeRoles('PROVIDER', 'ADMIN'),
  getProviderRecyclingRequests,
);

// ============================================
// UPDATE RECYCLING REQUEST STATUS
// ============================================

router.patch(
  '/:requestId/status',
  authenticateUser,
  authorizeRoles(
    'PROVIDER',
    'ADMIN',
  ),
  updateRecyclingRequestStatus,
);

// ============================================
// REQUEST PICKUP
// ============================================

router.patch(
  '/:requestId/pickup',
  authenticateUser,
  requestPickup,
);


module.exports = router;