const mongoose = require("mongoose");
const productsc = new mongoose.Schema({
    productName:String,
    price:Number,
    picture:String,
    detail:String
});
const model= mongoose.model("products",productsc);
module.exports=model;