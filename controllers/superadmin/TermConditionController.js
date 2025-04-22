const termCondition = require("../../models/TermCondition");
const logger = require("../../utils/logger");

// Get all FAQs
exports.getAllterm_Condition = async (req, res) => {
    try {
        const allFaq = await termCondition.find({ isDelete: 0 }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "All FAQs fetched successfully",
            data: allFaq,
        });
    } catch (error) {
        logger.error(`Error fetching FAQs: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Create Term & Condition
exports.createTermCondition = async (req, res) => {
    try {
        const { type, title,description } = req.body;

        if (!type || !title || !description) {
            return res.status(400).json({
                success: false,
                message: "Term and Condition are required",
            });
        }

        const newtermCondtion = new termCondition({ type, title,description });
        await newtermCondtion.save();

        res.status(201).json({
            success: true,
            message: "Term And Condtions created successfully",
            data: newtermCondtion,
        });
    } catch (error) {
        logger.error(`Error creating Term Condition : ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete Terms and Condition
exports.deleteTermCondition = async (req, res) => {
    const { deleteTerm_id } = req.body;

    if (!deleteTerm_id) {
        return res.status(400).json({
            success: false,
            message: "Term and condition is required",
        });
    }

    try {
        const termconditionData = await termCondition.findById(deleteTerm_id);

        if (!termconditionData) {
            return res.status(404).json({
                success: false,
                message: "Term & Condition not found",
            });
        }

        termconditionData.isDelete = 1;
        await termconditionData.save();

        res.status(200).json({
            success: true,
            message: "Term Condition deleted successfully",
        });
    } catch (err) {
        logger.error(`Error deleting Term Condition: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Update FAQ
exports.updateTermCondtion = async (req, res) => {
    const { _id } = req.params;
    const { type, title,description} = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "Term & Condition ID is required",
        });
    }

    if (!type || !title || !description) {
        return res.status(400).json({
            success: false,
            message: "Term & Condition are required",
        });
    }

    try {
        const termData = await termCondition.findById(_id);

        if (!termData || termData.isDelete === 1) {
            return res.status(404).json({
                success: false,
                message: "Term & Condition not found",
            });
        }

        termData.type = type;
        termData.title = title;
        termData.description = description;
        await termData.save();

        res.status(200).json({
            success: true,
            message: "Term & Condition updated successfully",
            data: termData,
        });
    } catch (err) {
        logger.error(`Error updating Term & Condition: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Update FAQ Status
exports.updateTermConditionStatus = async (req, res) => {
    const { _id } = req.params;
    const { isActive } = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "Term & Condition is required",
        });
    }

    const parsedStatus = parseInt(isActive);
    if (![0, 1].includes(parsedStatus)) {
        return res.status(400).json({
            success: false,
            message: "isActive must be 0 (inactive) or 1 (active)",
        });
    }

    try {
        const termConditionData = await termCondition.findById(_id);

        if (!termConditionData || termConditionData.isDelete === 1) {
            return res.status(404).json({
                success: false,
                message: "Term & Condition not found",
            });
        }

        termConditionData.isActive = parsedStatus;
        await termConditionData.save();

        res.status(200).json({
            success: true,
            message: "Term & Condition status updated successfully",
            data: termConditionData,
        });
    } catch (err) {
        logger.error(`Error updating Term & Condition status: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Get FAQ by ID
exports.getTermConditionById = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Term & Condition ID is required",
            });
        }

        const termCondtionDetails = await termCondition.findOne({ _id, isDelete: 0 });
        if (!termCondtionDetails) {
            return res.status(404).json({
                success: false,
                message: "Term & Condition not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Term & Condition fetched successfully",
            data: termCondtionDetails,
        });
    } catch (error) {
        logger.error(`Error fetching Term & Condition By ID: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};