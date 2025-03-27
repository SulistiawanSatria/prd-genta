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

    fileId: {
        type : String, required: true},

    reviews: [{type : mongoose.Schema.Types.ObjectId, ref : "Review"}],

    rating : {
        type : Number, default : 0
    }
    
}, 
    {   
    timestamps: true, 
}
    
);

const ProductModel = mongoose.model("Product", Product);
module.exports = ProductModel;
