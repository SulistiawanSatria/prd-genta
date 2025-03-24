const express = require("express");
const router = express.Router();
const { getAllReviews, getReviewByIdProduct, editReviewById } = require("../controllers/review_controller");

router.get("/product/:id", getReviewByIdProduct);
// router.put("/:id", reviewController.editReviewById);

module.exports = router;
