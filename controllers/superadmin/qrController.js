const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const filePaths = require('../../config/filePaths'); 
const QRCodeModel = require('../../models/QRCodeGenerate');

exports.createQRCode = async (req, res) => {
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
exports.getAllQRCodes = async (req, res) => {
  try {
    const { location_name, page = 1, limit = 10 } = req.query;

    // Build query object
    let query = {};
    if (location_name) {
      query.location_name = { $regex: location_name, $options: 'i' }; // case-insensitive search
    }

    const total = await QRCodeModel.countDocuments(query);

    const qrCodes = await QRCodeModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const qrCodePath = filePaths.QRCODE_DOCS_VIEW 
      ? `${filePaths.QRCODE_DOCS_VIEW.replace(/\\/g, '/')}` 
      : `${req.protocol}://${req.get('host')}/uploads/qrcode_docs`;

    const result = qrCodes.map(qr => ({
      _id: qr._id,
      location_name: qr.location_name,
      title: qr.title,
      description: qr.description,
      status: qr.status,
      createdAt: qr.createdAt,
      qr_code_image_url: `${qrCodePath}/${qr.qr_code_image}`
    }));

    res.status(200).json({
      success: true,
      message: "QR Codes fetched successfully",
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: result
    });
  } catch (err) {
    console.error("Error fetching QR codes:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
exports.deleteQRCodes = async (req, res) => {
    const { qrId } = req.query;
  
    if (!qrId) {
      return res.status(400).json({
        success: false,
        message: "QR Id is required",
      });
    }
  
    try {
      const qrDetails = await QRCodeModel.findById(qrId);
  
      if (!qrDetails) {
        return res.status(404).json({
          success: false,
          message: "QR Code not found",
        });
      }
  
      qrDetails.isDelete = 1;
      await qrDetails.save();
  
      res.status(200).json({
        success: true,
        message: "QR details deleted successfully",
      });
    } catch (err) {
      logger.error(`Error in Delete QR code: ${err.message}`, {
        stack: err.stack,
      });
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
};
exports.getQRCodeById = async (req, res) => {
  try {
    const { qr_id } = req.params;
    if (!qr_id) {
      return res.status(400).json({
        success: false,
        message: 'qr_id is required',
      });
    }

    // Fetch the QR code document by its _id
    const qrDoc = await QRCodeModel.findById(qr_id);
    if (!qrDoc) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found',
      });
    }

    // Convert document to plain object
    const qrCode = qrDoc.toObject();

    // Prepend base URL to qr_code_image if it exists
    const baseViewUrl = filePaths.QRCODE_DOCS_VIEW;
    if (qrCode.qr_code_image) {
      qrCode.qr_code_image = `${baseViewUrl}/${qrCode.qr_code_image}`;
    }

    return res.status(200).json({
      success: true,
      qrCode,
    });

  } catch (err) {
    logger.error(`Error fetching qrCode details: ${err.message}`, { stack: err.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
exports.updateQRCodeStatus = async (req, res) => {
  try {
    const { qr_id } = req.params;
    const { isActive } = req.body;

    // Validate input
    if (![0, 1].includes(isActive)) {
      return res.status(400).json({
        success: false,
        message: 'isActive must be 0 (inactive) or 1 (active)',
      });
    }

    // Update qrCode
    const qrCode = await QRCodeModel.findByIdAndUpdate(
      qr_id,
      { isActive },
      { new: true, select: '-password' }
    );

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'qrCode not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `qrCode has been ${isActive ? 'activated' : 'deactivated'}.`,
      qrCode,
    });
  } catch (err) {
    logger.error(`Error updating qr Code status: ${err.message}`, { stack: err.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
  
