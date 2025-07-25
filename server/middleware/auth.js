// server/middleware/auth.js
const jwt = require('jsonwebtoken'); // <-- ADD THIS LINE
// Make sure dotenv is configured if JWT_SECRET is accessed via process.env
// const dotenv = require('dotenv');
// dotenv.config(); // If not already done in server.js

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // This is line 13

      // Attach user to the request
      req.user = decoded; // decoded will contain { id: user._id, role: user.role }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' }); // 401 Unauthorized for invalid token
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' }); // 401 Unauthorized for missing token
  }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
        }
        next();
    };
};

module.exports = { protect, authorize };