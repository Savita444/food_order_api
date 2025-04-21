const bcrypt = require("bcrypt");
const Hotel = require("../../models/Hotel");
const User = require("../../models/userModel");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const logger = require("../../utils/logger");
const filePaths = require("../../config/filePaths"); // Import the filePaths config
const baseViewUrl = filePaths.HOTEL_DOCS_VIEW;
// const baseViewUrl = filePaths.HOTEL_DOCS_VIEW;
// Save base64-encoded images to the server
const saveBase64Image = (base64String, filePath) => {
  try {
    const matches = base64String.match(/^data:(image\/\w+);base64,([\s\S]+)/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], "base64");
      fs.writeFileSync(filePath, buffer);
      return true;
    } else {
      logger.error("Invalid base64 format:", base64String?.slice(0, 100));
      return false;
    }
  } catch (error) {
    logger.error(`Failed to write image to disk: ${error.message}`);
    return false;
  }
};
exports.createHotel = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const {
    role_id,
    user_id,
    email,
    password,
    mobile_no,
    hotel_name,
    bank_account_no,
    type,
    status,
    gst_certificate,
    pan_card,
    fssai_license,
  } = req.body;

  try {
    // const existing = await Hotel.findOne({ email });
    const existing = await Hotel.findOne({ user_id, email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Hotel already registered with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadDir = filePaths.HOTEL_DOCS_ADD;

    // Ensure the folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const saveImage = (base64, prefix) => {
      if (!base64) return null;
      const extMatch = base64.match(/^data:image\/(\w+);base64,/);
      if (!extMatch) return null;
      const ext = extMatch[1];
      const filename = `${prefix}_${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      const saved = saveBase64Image(base64, filePath);
      return saved ? filename : null;
    };

    const gstFile = saveImage(gst_certificate, "gst");
    const panFile = saveImage(pan_card, "pan");
    const fssaiFile = saveImage(fssai_license, "fssai");

    const newHotel = new Hotel({
      role_id,
      user_id,
      email,
      password: hashedPassword,
      mobile_no,
      hotel_name,
      bank_account_no,
      type,
      status,
      gst_certificate: gstFile,
      pan_card: panFile,
      fssai_license: fssaiFile,
    });

    await newHotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      hotel: {
        _id: newHotel._id,
        email: newHotel.email,
        mobile_no: newHotel.mobile_no,
        hotel_name: newHotel.hotel_name,
        gst_certificate: newHotel.gst_certificate,
        pan_card: newHotel.pan_card,
        fssai_license: newHotel.fssai_license,
        status: newHotel.status,
        createdAt: newHotel.createdAt,
      },
    });
  } catch (err) {
    logger.error(`Error creating hotel: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// exports.getAllHotels = async (req, res) => {
//   try {
//     const { hotel_name = '', page = 1, limit = 10 } = req.body || {};

//     const query = {};

//     if (hotel_name) {
//       query.hotel_name = { $regex: hotel_name, $options: 'i' }; // case-insensitive search
//     }

//     const skip = (page - 1) * limit;

//     const [hotels, total] = await Promise.all([
//       Hotel.find(query)
//         .select('-password')
//         .skip(skip)
//         .limit(Number(limit))
//         .sort({ createdAt: -1 }),

//       Hotel.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       currentPage: Number(page),
//       totalPages: Math.ceil(total / limit),
//       totalRecords: total,
//       hotels,
//     });
//   } catch (err) {
//     logger.error(`Error fetching hotels: ${err.message}`, { stack: err.stack });
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//     });
//   }
// };
exports.getAllHotels = async (req, res) => {
  try {
    const { user_id, hotel_name = "", page = 1, limit = 10 } = req.body || {};

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const query = { user_id };
    if (hotel_name) {
      query.hotel_name = { $regex: hotel_name, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [rawHotels, total] = await Promise.all([
      Hotel.find(query)
        .select("-password")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Hotel.countDocuments(query),
    ]);

    const hotels = rawHotels.map((hotel) => {
      const doc = hotel.toObject();
      ["gst_certificate", "pan_card", "fssai_license"].forEach((field) => {
        if (doc[field]) {
          doc[field] = `${baseViewUrl}/${doc[field]}`;
        }
      });
      return doc;
    });

    res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      hotels,
    });
  } catch (err) {
    logger.error(`Error fetching hotels: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteHotel = async (req, res) => {
  const { hotelId } = req.body;

  if (!hotelId) {
    return res.status(400).json({
      success: false,
      message: "hotelId is required",
    });
  }

  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    hotel.isDelete = 1;
    await hotel.save();

    res.status(200).json({
      success: true,
      message: "Hotel soft-deleted successfully",
    });
  } catch (err) {
    logger.error(`Error in softDeleteHotel: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
