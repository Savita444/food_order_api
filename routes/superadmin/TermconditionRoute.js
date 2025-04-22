const express = require("express");
const router = express.Router();
const termconditionController = require("../../controllers/superadmin/TermConditionController");
const termCondtionValidator = require("../../validations/TermConditionValidator");

// Static routes
router.post("/add", termCondtionValidator.createtermConditionValidation , termconditionController.createTermCondition);
router.post("/list", termconditionController.getAllterm_Condition);
router.post("/delete", termconditionController.deleteTermCondition);
router.post("/update/:_id", termconditionController.updateTermCondtion);
router.post("/status/:_id", termconditionController.updateTermConditionStatus);

// Get by ID (Keep last)
router.post("/:_id", termconditionController.getTermConditionById);

module.exports = router;
