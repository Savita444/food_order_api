// module.exports = router;
const express = require('express');
const router = express.Router();
const hotelValidator = require('../../validations/hotelValidator');
const hotelController = require('../../controllers/superadmin/hotelController');
const { verifySuperAdmin } = require('../../middlewares/auth');
// Create hotel route with validation middleware
router.post('/add',verifySuperAdmin, hotelValidator.createHotelValidation, hotelController.createHotel);
router.post('/list', verifySuperAdmin, hotelController.getAllHotels);
router.post('/delete', verifySuperAdmin, hotelController.deleteHotel);
router.post('/:hotel_id', verifySuperAdmin, hotelController.getHotelById);
router.post('/status/:hotel_id', verifySuperAdmin, hotelController.updateHotelStatus);


module.exports = router;
