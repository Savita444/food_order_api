const express = require('express');
const router = express.Router();

// Import child routes
const hotelRoute = require('./hotelRoute');
// const qrRoute = require('./qrRoute');

// Use child routes with appropriate prefixes
router.use('/hotel', hotelRoute);
// router.use('/qr', qrRoute);

module.exports = router;
