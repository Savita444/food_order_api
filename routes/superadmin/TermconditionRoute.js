const express = require("express");
const router = express.Router();
const termconditionController = require("../../controllers/superadmin/TermConditionController");
const termCondtionValidator = require("../../validations/TermConditionValidator");

//Get all data
router.post("/list", termconditionController.getAllterm_Condition);
//Update Data 
router.post("/update/:_id", termconditionController.updateTermCondtion);
//Get by ID data
router.post("/:_id", termconditionController.getTermConditionById);

module.exports = router;
