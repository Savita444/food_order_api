const { body } = require('express-validator');

exports.createFaqValidation = [
    // Question validation
    body('question')
        .notEmpty().withMessage('Question is required')
        .isLength({ min: 2 }).withMessage('Question must be at least 2 characters'),
    
    // Answer validation
    body('answer')
        .notEmpty().withMessage('Answer is required')
        .isLength({ min: 5 }).withMessage('Answer must be at least 5 characters')
]