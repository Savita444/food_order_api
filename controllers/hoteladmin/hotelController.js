const bcrypt = require("bcrypt");
const Hotel = require("../../models/Hotel");
const User = require("../../models/userModel");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const logger = require("../../utils/logger");
const filePaths = require("../../config/filePaths"); 
const baseViewUrl = filePaths.HOTEL_DOCS_VIEW;

// exports.getAllHotels = async (req, res) => {
//   try {
//     const { user_id, hotel_name = "", page = 1, limit = 10 } = req.body || {};

//     if (!user_id) {
//       return res.status(400).json({
//         success: false,
//         message: "user_id is required",
//       });
//     }

//     const query = { user_id };
//     if (hotel_name) {
//       query.hotel_name = { $regex: hotel_name, $options: "i" };
//     }

//     const skip = (page - 1) * limit;

//     const [rawHotels, total] = await Promise.all([
//       Hotel.find(query)
//         .select("-password")
//         .skip(skip)
//         .limit(Number(limit))
//         .sort({ createdAt: -1 }),
//       Hotel.countDocuments(query),
//     ]);

//     const hotels = rawHotels.map((hotel) => {
//       const doc = hotel.toObject();
//       ["gst_certificate", "pan_card", "fssai_license"].forEach((field) => {
//         if (doc[field]) {
//           doc[field] = `${baseViewUrl}/${doc[field]}`;
//         }
//       });
//       return doc;
//     });

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
//       message: "Internal Server Error",
//     });
//   }
// };
exports.getHotelById = async (req, res) => {
  try {
    const { hotel_id } = req.params;
    if (!hotel_id) {
      return res.status(400).json({
        success: false,
        message: 'hotel_id is required',
      });
    }

    // Fetch the hotel by its _id, omit the password
    const hotelDoc = await Hotel.findById(hotel_id).select('-password');
    if (!hotelDoc) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // Convert to plain object
    const hotel = hotelDoc.toObject();

    // Prepend your FILE_VIEW base URL to each doc filename
    const baseViewUrl = filePaths.HOTEL_DOCS_VIEW;
    ['gst_certificate', 'pan_card', 'fssai_license'].forEach(field => {
      if (hotel[field]) {
        hotel[field] = `${baseViewUrl}/${hotel[field]}`;
      }
    });

    // Send back the full hotel details
    return res.status(200).json({
      success: true,
      hotel
    });

  } catch (err) {
    logger.error(`Error fetching hotel details: ${err.message}`, { stack: err.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
