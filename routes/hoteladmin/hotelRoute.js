// module.exports = router;
const express = require('express');
const router = express.Router();
const hotelController = require('../../controllers/hoteladmin/hotelController');
const { verifyHotelAdmin } = require('../../middlewares/auth');
// Create hotel route with validation middleware
// router.post('/list', verifyHotelAdmin, hotelController.getAllHotels);
router.post('/:hotel_id', verifySuperAdmin, hotelController.getHotelById);


module.exports = router;
