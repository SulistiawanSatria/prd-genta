const mongoose = require("mongoose");

//Model untuk product
const Product = new mongoose.Schema({
    name: {
        type : String, required: true},

    price: {
        type : Number, required: true},

    description: {
        type : String, required: true},

    image: {
        type : String, required: true},

    reviews: [{type : mongoose.Schema.Types.ObjectId, ref : "Review"}]    
}, 
    {timestamps: true}
    
);

//membuat virtual untuk menghitung rata-rata rating
Product.virtual("average_rating").get(function () {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / this.reviews.length;
});

//menghapus reviews dari JSON agar tidak muncul di respon
// Product.set("toJSON", {
//     virtuals:true,
//     versionKey: false,
//     transform: function(doc, ret) {
//         delete ret.reviews;
//         return ret;
//     }
// });


const ProductModel = mongoose.model("Product", Product);
module.exports = ProductModel;
