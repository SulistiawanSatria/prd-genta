const Review = require("../models/review_models");

const getReviewByIdProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ product_id: id }).populate("product_id");
        res.status(200).json({
            success: true,
            message: "Review found",
            data: reviews,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const editReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Review updated",
            data: review,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = { getReviewByIdProduct , editReviewById};