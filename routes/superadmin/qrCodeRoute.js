const express = require('express');
const router = express.Router();
const qrController = require('../../controllers/superadmin/qrController');
const { verifySuperAdmin } = require('../../middlewares/auth');
const qrValidator = require('../../validations/qrValidator'); 

router.post('/add', verifySuperAdmin, qrValidator.createQrValidation, qrController.createQRCode);
router.post('/list', verifySuperAdmin, qrValidator.createQrValidation, qrController.getAllQRCodes);
router.post('/delete', verifySuperAdmin, qrValidator.createQrValidation, qrController.deleteQRCodes);
router.post('/:qr_id', verifySuperAdmin, qrController.getQRCodeById);
router.post('/status/:qr_id', verifySuperAdmin, qrController.updateQRCodeStatus);

module.exports = router;
