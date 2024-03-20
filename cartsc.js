const mongoose = require("mongoose");
let schema = new mongoose.Schema({
   productName:String,
   price:Number,
   picture:String,
   detail:String,
   username:String 
})

let model = mongoose.model("carts",schema);
module.exports= model;