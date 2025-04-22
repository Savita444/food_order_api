const express = require('express');
const router = express.Router();

// Import child routes
const hotelRoute = require('./hotelRoute');
const qrCodeRoute = require('./qrCodeRoute');
const faqCodeRoute = require('./FaqRoute');
const termcondition = require('./TermconditionRoute')
const faqroute = require('./');

// Use child routes with appropriate prefixes
router.use('/hotel', hotelRoute);
router.use('/qrCode', qrCodeRoute);
router.use('/faq', faqCodeRoute);
router.use('/termcondition',termcondition)
// router.use('/qr', qrRoute);

// http://localhost:5000/api/superadmin/hotel/add

module.exports = router;
