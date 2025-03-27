const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./connectors/db");
const productRouter = require("./routers/product_router");
const reviewRouter = require("./routers/review_router");
const errorHandler = require("./middleware/error_handler");

require("dotenv").config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ credentials: true, origin: "*" }));

//route apps
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000; // Tambahkan default port 8000 untuk health check koyeb

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});