const express = require('express');
const router = express.Router();

// Import child routes
const hotelRoute = require('./hotelRoute');

// Use child routes with appropriate prefixes
router.use('/hotel', hotelRoute);

module.exports = router;
