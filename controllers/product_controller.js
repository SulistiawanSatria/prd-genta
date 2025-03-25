const mongoose = require("mongoose");
const Product = require("../models/product_models");
const Review = require("../models/review_models"); 

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean(); 

        res.json({
            success: true,
            message: "Products found",
            data: products,
        });
    } catch (error) {
        res.status(500).json({ message: "Error: Failed to get products", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Pastikan ID yang diterima adalah valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id).lean();
        console.log(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Query review berdasarkan product_id
        const reviews = await Review.find({ product_id: id }).lean();
        // Menambahkan reviews ke dalam object product
        product.reviews = reviews;

        res.json({
            success: true,
            message: "Product found",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ message: "Error: Failed to get product", error: error.message });
    }
};

module.exports = { getAllProducts, getProductById };
