const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAny } = require('../middlewares/auth');

router.post('/login', authController.login);


router.post('/logout', verifyAny, authController.logout);
module.exports = router;
