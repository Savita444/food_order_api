const faq = require("../../models/Faq");
const logger = require("../../utils/logger");

// Create FAQ
exports.createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: "Question and Answer are required",
            });
        }

        const newFaq = new faq({ question, answer });
        await newFaq.save();

        res.status(201).json({
            success: true,
            message: "FAQ created successfully",
            data: newFaq,
        });
    } catch (error) {
        logger.error(`Error creating FAQ: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// Get all FAQs with search and pagination
exports.getAllFaq = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;

        // Build search query
        const query = {
            isDelete: 0,
            question: { $regex: search, $options: 'i' } // case-insensitive search
        };

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Get total count for pagination
        const totalFaqs = await faq.countDocuments(query);

        // Fetch paginated and filtered data
        const allFaq = await faq
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            message: "FAQs fetched successfully",
            data: allFaq,
            pagination: {
                total: totalFaqs,
                page: pageNumber,
                limit: limitNumber,
                pages: Math.ceil(totalFaqs / limitNumber)
            }
        });
    } catch (error) {
        logger.error(`Error fetching FAQs: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get FAQ by ID
exports.getFaqById = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "FAQ ID is required",
            });
        }

        const faqDetails = await faq.findOne({ _id, isDelete: 0 });
        if (!faqDetails) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "FAQ fetched successfully",
            data: faqDetails,
        });
    } catch (error) {
        logger.error(`Error fetching FAQ by ID: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Delete FAQ (Soft delete)
exports.deleteFaq = async (req, res) => {
    const { delete_id } = req.body;

    if (!delete_id) {
        return res.status(400).json({
            success: false,
            message: "FAQ ID is required",
        });
    }

    try {
        const faqData = await faq.findById(delete_id);

        if (!faqData) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }

        faqData.isDelete = 1;
        await faqData.save();

        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully",
        });
    } catch (err) {
        logger.error(`Error deleting FAQ: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
    const { _id } = req.params;
    const { question, answer } = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "FAQ ID is required",
        });
    }

    if (!question || !answer) {
        return res.status(400).json({
            success: false,
            message: "Question and Answer are required",
        });
    }

    try {
        const faqData = await faq.findById(_id);

        if (!faqData || faqData.isDelete === 1) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }

        faqData.question = question;
        faqData.answer = answer;
        await faqData.save();

        res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: faqData,
        });
    } catch (err) {
        logger.error(`Error updating FAQ: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update FAQ Status
exports.updateFaqStatus = async (req, res) => {
    const { _id } = req.params;
    const { isActive } = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "FAQ ID is required",
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
        const faqData = await faq.findById(_id);

        if (!faqData || faqData.isDelete === 1) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }

        faqData.isActive = parsedStatus;
        await faqData.save();

        res.status(200).json({
            success: true,
            message: "FAQ status updated successfully",
            data: faqData,
        });
    } catch (err) {
        logger.error(`Error updating FAQ status: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
