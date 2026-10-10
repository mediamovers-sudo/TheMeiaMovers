const rateLimit = require('express-rate-limit');

// Rate limit login endpoint to protect against brute force attacks
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
  }
});

// General public form rate limiter (e.g. applications)
const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Submission rate limit reached. Please wait before submitting another application.'
  }
});

module.exports = {
  loginRateLimiter,
  publicFormLimiter
};
