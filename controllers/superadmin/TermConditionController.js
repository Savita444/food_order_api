const termCondition = require("../../models/TermCondition");
const logger = require("../../utils/logger");

// Get all Term and Condition
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


// Update Term and Condition
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





// Get term and condition by ID
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