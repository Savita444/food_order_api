const { body } = require('express-validator');

exports.createQrValidation = [
  // Location Name validation
  body('location_name')
    .notEmpty().withMessage('Location name is required')
    .isLength({ min: 2 }).withMessage('Location name must be at least 2 characters'),

  // Title validation
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),

  // Description validation
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters')
];
