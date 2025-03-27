const express = require("express");
const router = express.Router();
const { getAllReviews, getReviewByIdProduct, editReviewById } = require("../controllers/review_controller");
const reviewController = require("../controllers/review_controller");
const upload = require("../middleware/upload");

router.get("/product/:id", getReviewByIdProduct);
router.post("/", upload.single('image_user'), reviewController.createReview);
router.patch("/:id", upload.single('image_user'), reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
// router.put("/:id", reviewController.editReviewById);

module.exports = router;
