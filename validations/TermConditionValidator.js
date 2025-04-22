const { body } = require('express-validator');

exports.createtermConditionValidation = [

    body('type')
        .notEmpty().withMessage('type is required')
        .isLength({ min: 2 }).withMessage('type must be at least 2 characters'),


    body('title')
        .notEmpty().withMessage('title is required')
        .isLength({ min: 5 }).withMessage('title must be at least 5 characters'),

    body('description')
        .notEmpty().withMessage('description is required')
        .isLength({ min: 5 }).withMessage('description must be at least 5 characters')
]