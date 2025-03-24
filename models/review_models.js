const mongoose = require("mongoose"); 

//Model untuk review Item
const Review = new mongoose.Schema({
    product_id:{
        type : mongoose.Schema.Types.ObjectId, ref : "Product", required: true
    },

    user_id: {
        type : mongoose.Schema.Types.ObjectId, ref : "User", required: true
    },

    rating: {
        type : Number, required: true, min: 1, max: 5
    },

    review_text: {
        type : String, required: true
    },

    image_user: {
        type : String, required: true
    },

    size_user : {
        bust : {type : Number, required: true},
        waist : {type : Number, required: true},
        hips : {type : Number, required: true},
        height : {type : Number, required: true},
        weight : {type : Number, required: true}
    },

    ThumbUp_rate: {
        type : Number, required: true, default: 0
    }
},
    {timestamps: true}
    );

const ReviewModels = mongoose.model("Review", Review);
module.exports = ReviewModels