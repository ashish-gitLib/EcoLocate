const jwt = require('jsonwebtoken');


// ======================================================
// AUTHENTICATE USER
// ======================================================

const authenticateUser = (req, res, next) => {
  try {

    // Get Authorization header
    const authHeader =
      req.headers.authorization;


    // Check if token exists
    if (!authHeader) {
      return res.status(401).json({
        message:
          'Access denied. Token not provided.',
      });
    }


    // Expected format:
    // Bearer TOKEN
    const token =
      authHeader.split(' ')[1];


    if (!token) {
      return res.status(401).json({
        message:
          'Access denied. Invalid token format.',
      });
    }


    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );


    // Save logged-in user information
    // inside the request
    req.user = decoded;
    


    // Continue to next function
    next();


  } catch (error) {

    return res.status(401).json({
      message:
        'Access denied. Invalid or expired token.',
    });

  }
};


// ======================================================
// AUTHORIZE ROLES
// ======================================================

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          'You do not have permission to perform this action.',
      });
    }

    next();
  };
};


module.exports = {
  authenticateUser,
  authorizeRoles,
};