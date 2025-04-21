// module.exports = router;
const express = require('express');
const router = express.Router();
const hotelValidator = require('../../validations/hotelValidator');
const hotelController = require('../../controllers/superadmin/hotelController');
const { verifyHotelAdmin } = require('../../middlewares/auth');
// Create hotel route with validation middleware
router.post('/add',verifyHotelAdmin, hotelValidator.createHotelValidation, hotelController.createHotel);
router.post('/list', verifyHotelAdmin, hotelController.getAllHotels);
router.post('/delete', verifyHotelAdmin, hotelController.deleteHotel);

module.exports = router;
