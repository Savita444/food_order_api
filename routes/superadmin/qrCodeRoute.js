const express = require('express');
const router = express.Router();
const qrController = require('../../controllers/superadmin/qrController');
const { verifyHotelAdmin } = require('../../middlewares/auth');
const qrValidator = require('../../validations/qrValidator'); // Or a dedicated QR validator

router.post('/add', verifyHotelAdmin, qrValidator.createQrValidation, qrController.createQRCode);

module.exports = router;
