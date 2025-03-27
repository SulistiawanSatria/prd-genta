const mongoose = require("mongoose");
const Review = require("../models/review_models");
const Product = require("../models/product_models");
const { uploadImage, deleteImage } = require("../utils/imagekit");

const getReviewByIdProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Validasi ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // Cek apakah produk ada
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Get total reviews count
        const totalReviews = await Review.countDocuments({ product_id: id });

        // Get paginated reviews
        const reviews = await Review.find({ product_id: id })
            .populate("product_id")
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            message: "Reviews found",
            data: reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error: Failed to get reviews", 
            error: error.message 
        });
    }
};

const createReview = async (req, res) => {
    try {
        const { product_id, user_id, rating, review_text, size_user } = req.body;
        const imageFile = req.file;

        // Validasi input
        if (!product_id || !user_id || !rating || !review_text || !imageFile || !size_user) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validasi ID
        if (!mongoose.isValidObjectId(product_id) || !mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product_id or user_id"
            });
        }

        // Cek apakah produk ada
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Validasi rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Validasi review text
        if (review_text.length < 10 || review_text.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Review text must be between 10 and 500 characters"
            });
        }

        // Validasi size_user
        const { bust, waist, hips, height, weight } = size_user;
        if (!bust || !waist || !hips || !height || !weight) {
            return res.status(400).json({
                success: false,
                message: "All size measurements are required"
            });
        }

        // Upload gambar ke ImageKit
        const { url, fileId } = await uploadImage(imageFile, 'reviews');

        const review = new Review({
            product_id,
            user_id,
            rating,
            review_text,
            image_user: url,
            fileId,
            size_user
        });

        await review.save();

        // Update rating produk
        const reviews = await Review.find({ product_id });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        await Product.findByIdAndUpdate(product_id, { rating: averageRating });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Failed to create review",
            error: error.message
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, review_text, size_user } = req.body;
        const imageFile = req.file;

        // Validasi ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        // Cek apakah review ada
        const existingReview = await Review.findById(id);
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Validasi input jika ada
        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be between 1 and 5"
                });
            }
        }

        if (review_text) {
            if (review_text.length < 10 || review_text.length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Review text must be between 10 and 500 characters"
                });
            }
        }

        if (size_user) {
            const { bust, waist, hips, height, weight } = size_user;
            if (!bust || !waist || !hips || !height || !weight) {
                return res.status(400).json({
                    success: false,
                    message: "All size measurements are required"
                });
            }
        }

        let updateData = { rating, review_text, size_user };

        // Jika ada file gambar baru
        if (imageFile) {
            // Hapus gambar lama dari ImageKit
            await deleteImage(existingReview.fileId);

            // Upload gambar baru
            const { url, fileId } = await uploadImage(imageFile, 'reviews');
            updateData = { ...updateData, image_user: url, fileId };
        }

        // Update review
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // Update rating produk
        const reviews = await Review.find({ product_id: existingReview.product_id });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        await Product.findByIdAndUpdate(existingReview.product_id, { rating: averageRating });

        res.json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Failed to update review",
            error: error.message
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        // Cek apakah review ada
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Simpan product_id untuk update rating nanti
        const product_id = review.product_id;

        // Hapus gambar dari ImageKit
        await deleteImage(review.fileId);

        // Hapus review
        await Review.findByIdAndDelete(id);

        // Update rating produk
        const reviews = await Review.find({ product_id });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        await Product.findByIdAndUpdate(product_id, { rating: averageRating });

        res.json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Failed to delete review",
            error: error.message
        });
    }
};

module.exports = { 
    getReviewByIdProduct, 
    createReview, 
    updateReview, 
    deleteReview 
};