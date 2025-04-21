const express = require("express");
const router = express.Router();
const faqController = require("../../controllers/superadmin/faqController");
const faqValidator = require("../../validations/FaqValidator");

// Static routes
router.post("/add", faqValidator.createFaqValidation, faqController.createFaq);
router.post("/list", faqController.getAllFaq);
router.post("/delete", faqController.deleteFaq);
router.post("/update/:_id", faqController.updateFaq);
router.post("/status/:_id", faqController.updateFaqStatus);

// Get by ID (Keep last)
router.post("/:_id", faqController.getFaqById);

module.exports = router;
