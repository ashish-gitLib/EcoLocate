const Facility = require('../models/Facility');
const RecyclingRequest = require('../models/RecyclingRequest');




// ============================================
// CREATE RECYCLING REQUEST
// ============================================

const createRecyclingRequest = async (req, res) => {
  try {
    const {
  deviceName,
  deviceCategory,
  brand,
  model,
  condition,
  imageUri,
  facilityId,
  facilityName,
  facilityLatitude,
  facilityLongitude,
  estimatedEcoCoins,
} = req.body;

  
    // Validate required fields
   console.log('REQUEST BODY RECEIVED:', req.body);

console.log('REQUIRED DATA:', {
  deviceName,
  facilityId,
  facilityName,
});

if (
  !deviceName ||
  !facilityId ||
  !facilityName
) {
  return res.status(400).json({
    success: false,
    message: 'Required request information is missing.',

    missing: {
      deviceName: !deviceName,
      facilityId: !facilityId,
      facilityName: !facilityName,
    },
  });
}

    // Create request
    const recyclingRequest = await RecyclingRequest.create({
      userId: req.user.userId,

      deviceName,
      deviceCategory,
      brand,
      model,
      condition,
      imageUri,

      facilityId,
facilityName,

facilityLatitude,
facilityLongitude,

estimatedEcoCoins,

      status: 'pending',
    });

    console.log(
  'CREATED REQUEST:',
  recyclingRequest.toObject(),
);

    return res.status(201).json({
      success: true,
      message: 'Recycling request created successfully.',
      request: recyclingRequest,
    });

  } catch (error) {
    console.error(
      'Create recycling request error:',
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: 'Unable to create recycling request.',
    });
  }
};


// ============================================
// GET USER'S RECYCLING REQUESTS
// ============================================

const getMyRecyclingRequests = async (req, res) => {
  try {
    const requests = await RecyclingRequest.find({
  userId: req.user.userId,
}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {
    console.error(
      'Get recycling requests error:',
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch recycling requests.',
    });
  }
};

        // ============================================
// GET PROVIDER'S FACILITY RECYCLING REQUESTS
// ============================================

const getProviderRecyclingRequests = async (req, res) => {
  try {

    const facilities = await Facility.find({
      providerId: req.user.userId,
    });


    const facilityIds = facilities.map(
      facility => facility._id,
    );


    const requests = await RecyclingRequest.find({
      facilityId: {
        $in: facilityIds,
      },
    }).sort({
      createdAt: -1,
    });


    return res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {

    console.error(
      'Get provider recycling requests error:',
      error.message,
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to fetch provider recycling requests.',
    });

  }
};

    // ============================================
// UPDATE RECYCLING REQUEST STATUS
// ============================================

const updateRecyclingRequestStatus = async (req, res) => {
  try {
    const {requestId} = req.params;

    const {status} = req.body;


    // Allowed statuses
    const allowedStatuses = [
      'pending',
      'approved',
      'rejected',
      'recycled',
    ];


    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recycling request status.',
      });
    }


    // Find request
    const recyclingRequest =
      await RecyclingRequest.findById(requestId);


    if (!recyclingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Recycling request not found.',
      });
    }

    if (req.user.role === 'PROVIDER') {

  const facility = await Facility.findOne({
    _id: recyclingRequest.facilityId,
    providerId: req.user.userId,
  });

  if (!facility) {
    return res.status(403).json({
      success: false,
      message:
        'You are not authorized to update this recycling request.',
    });
  }
}


    // Update status
    recyclingRequest.status = status;

    await recyclingRequest.save();


    return res.status(200).json({
      success: true,
      message:
        'Recycling request status updated successfully.',
      request: recyclingRequest,
    });

  } catch (error) {

    console.error(
      'Update recycling request status error:',
      error.message,
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to update recycling request status.',
    });
  }
};

// ============================================
// REQUEST PICKUP
// ============================================

const requestPickup = async (req, res) => {
  try {

    const {requestId} = req.params;

    const {
      pickupAddress,
      pickupDate,
      pickupPhoneNumber,
      pickupInstructions,
    } = req.body;


    // Validate required fields
    if (!pickupAddress || !pickupPhoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          'Pickup address and phone number are required.',
      });
    }


    // Find the recycling request
    const recyclingRequest =
      await RecyclingRequest.findOne({
        _id: requestId,
        userId: req.user.userId,
      });


    // Check if request exists and belongs to user
    if (!recyclingRequest) {
      return res.status(404).json({
        success: false,
        message:
          'Recycling request not found.',
      });
    }


    // Update pickup details
    recyclingRequest.pickupRequested = true;

    recyclingRequest.pickupAddress =
      pickupAddress;

    recyclingRequest.pickupDate =
      pickupDate;

    recyclingRequest.pickupPhoneNumber =
      pickupPhoneNumber;

    recyclingRequest.pickupInstructions =
      pickupInstructions;

    recyclingRequest.pickupStatus =
      'requested';


    await recyclingRequest.save();


    return res.status(200).json({
      success: true,
      message:
        'Pickup request submitted successfully.',
      request: recyclingRequest,
    });


  } catch (error) {

    console.error(
      'Request pickup error:',
      error.message,
    );


    return res.status(500).json({
      success: false,
      message:
        'Unable to submit pickup request.',
    });

  }
};


module.exports = {
  createRecyclingRequest,
  getMyRecyclingRequests,
  getProviderRecyclingRequests,
  updateRecyclingRequestStatus,
  requestPickup,
};