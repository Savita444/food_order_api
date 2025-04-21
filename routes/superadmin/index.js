const express = require('express');
const router = express.Router();

// Import child routes
const hotelRoute = require('./hotelRoute');
const qrCodeRoute = require('./qrCodeRoute');

// Use child routes with appropriate prefixes
router.use('/qrCode', qrCodeRoute);
// router.use('/qr', qrRoute);

module.exports = router;
