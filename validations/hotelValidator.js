const { body } = require('express-validator');

// Regex for valid base64-encoded image strings
const base64ImagePattern = /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=\r\n]+$/;
exports.createHotelValidation = [
  // Role ID validation
  body('role_id')
    .notEmpty().withMessage('Role ID is required')
    .isMongoId().withMessage('Invalid Role ID format'),

  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[A-Za-z0-9]/).withMessage('Password must contain letters and numbers'),

 // Mobile number validation (clean up non-digit characters and validate)
 body('mobile_no')
 .notEmpty().withMessage('Mobile number is required')
 .custom(value => {
   const cleanedValue = value.replace(/\D/g, '');  // Remove anything that's not a digit
   if (!/^[0-9]{10}$/.test(cleanedValue)) {
     throw new Error('Mobile number must be 10 digits');
   }
   return true;
 }),
  // Hotel name validation
  body('hotel_name')
    .notEmpty().withMessage('Hotel name is required')
    .isLength({ min: 3 }).withMessage('Hotel name must be at least 3 characters'),

  // Bank account validation
  body('bank_account_no')
    .optional()
    .isLength({ min: 9, max: 18 }).withMessage('Bank account number must be between 9 and 18 digits'),

  // Type validation
  body('type')
    .optional()
    .isString().withMessage('Type must be a string'),

  // Status validation
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),

  // Base64 image validation (GST, PAN, FSSAI)
  body('gst_certificate')
    .optional()
    .matches(base64ImagePattern)
    .withMessage('GST certificate must be a valid base64 image string'),

  body('pan_card')
    .optional()
    .matches(base64ImagePattern)
    .withMessage('PAN card must be a valid base64 image string'),

  body('fssai_license')
    .optional()
    .matches(base64ImagePattern)
    .withMessage('FSSAI license must be a valid base64 image string'),
];
