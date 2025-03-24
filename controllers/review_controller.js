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

// const filterReviews = async (req, res) => {
//     try {
//         const { type, rating } = req.query;
//         let query = {};
//         let sort = {};

//         switch (type) {
//             case "NewestReviews":
//                 sort = { createdAt: -1 };
//                 break;
//             case "Photo/Video":
//                 query = { image_user: { $ne: [] } };
//                 break;
//             case "Rating:All":
//                 query = { rating: { $gte: 1, $lte: 5 } };
//                 break;
//             default:
//                 query = { rating: Number(rating) };
//                 break;
//         }

//         const reviews = await Review.find(query).sort(sort).lean();

//         res.json({
//             success: true,
//             message: `Reviews filtered by ${type === "Rating:All" ? "Rating:All" : `Rating: ${rating}`}`,
//             data: reviews,
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error: Failed to filter reviews" });
//     }
// };

module.exports = { getReviewByIdProduct , editReviewById};