const mongoose = require("mongoose");
const Product = require("../models/product_models");
const Review = require("../models/review_models");
const { uploadImage, deleteImage } = require("../utils/imagekit");

const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total products count
        const totalProducts = await Product.countDocuments();

        // Get paginated products
        const products = await Product.find()
            .populate("reviews")
            .skip(skip)
            .limit(limit)
            .lean();

        for (const product of products) {
            const reviews = await Review.find({ product_id: product._id });

            // Hitung rata-rata rating
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

            // Simpan rating ke database (hanya jika ada perubahan)
            await Product.findByIdAndUpdate(product._id, { rating: averageRating });

            // Tambahkan rating ke objek produk yang dikirimkan ke response
            product.rating = averageRating;
        }

        res.json({
            success: true,
            message: "Products found",
            data: products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error: Failed to get products", 
            error: error.message 
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Pastikan ID yang diterima adalah valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id).populate("reviews").lean();
        console.log(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const reviews = await Review.find({ product_id: id });

        // Hitung rata-rata rating
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        // Simpan rating ke database jika ada perubahan
        await Product.findByIdAndUpdate(id, { rating: averageRating });

        // Tambahkan rating ke objek product
        product.reviews = reviews;
        product.rating = averageRating;
        console.log("Product:", product);
        console.log(reviews);

        res.json({
            success: true,
            message: "Product found",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ message: "Error: Failed to get product", error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const imageFile = req.file;

        // Validasi input
        if (!name || !price || !description || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validasi panjang nama
        if (name.length < 3 || name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 3 and 100 characters"
            });
        }

        // Validasi harga
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        // Validasi deskripsi
        if (description.length < 10 || description.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Description must be between 10 and 500 characters"
            });
        }

        // Upload gambar ke ImageKit
        const { url, fileId } = await uploadImage(imageFile, 'products');

        const product = new Product({
            name,
            price,
            description,
            image: url,
            fileId
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Failed to create product",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const imageFile = req.file;

        // Validasi ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // Cek apakah produk ada
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Validasi input jika ada
        if (name) {
            if (name.length < 3 || name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be between 3 and 100 characters"
                });
            }
        }

        if (price) {
            if (price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price must be greater than 0"
                });
            }
        }

        if (description) {
            if (description.length < 10 || description.length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be between 10 and 500 characters"
                });
            }
        }

        let updateData = { name, price, description };

        // Jika ada file gambar baru
        if (imageFile) {
            // Hapus gambar lama dari ImageKit
            await deleteImage(existingProduct.fileId);

            // Upload gambar baru
            const { url, fileId } = await uploadImage(imageFile, 'products');
            updateData = { ...updateData, image: url, fileId };
        }

        // Update produk
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Failed to update product",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

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

        // Hapus gambar dari ImageKit
        await deleteImage(product.fileId);

        // Hapus semua review terkait
        await Review.deleteMany({ product_id: id });

        // Hapus produk
        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product and associated reviews deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Failed to delete product",
            error: error.message
        });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
