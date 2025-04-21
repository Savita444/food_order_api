const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const filePaths = require('../../config/filePaths'); 
const QRCodeModel = require('../../models/QRCodeGenerate');

exports.createQRCode = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array(),
//     });
//   }

  const { location_name, title, description } = req.body;

  try {
    // Check for duplicate
    const existing = await QRCodeModel.findOne({ location_name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "QR Code already exists with this location",
      });
    }

    const uploadDir = filePaths.QRCODE_DOCS_ADD || path.join(__dirname, '../../public/qrcodes');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const qrText = `${title}\n${description}`;
    const fileName = `qr_${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    // Generate QR and save
    await QRCode.toFile(filePath, qrText);

    const newQR = new QRCodeModel({
      location_name,
      title,
      description,
      qr_code_image: fileName,
    });

    await newQR.save();

    res.status(201).json({
      success: true,
      message: "QR Code generated and saved successfully",
      data: {
        _id: newQR._id,
        location_name: newQR.location_name,
        title: newQR.title,
        description: newQR.description,
        qr_code_image: fileName,
        status: newQR.status,
        createdAt: newQR.createdAt,
      },
    });
  } catch (err) {
    logger.error(`Error creating QR Code: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
