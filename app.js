const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./connectors/db");
const productRouter = require("./routers/product_router");
const reviewRouter = require("./routers/review_router");
// const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(cookieParser());

app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
});

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});