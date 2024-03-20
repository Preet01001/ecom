const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username:String,
    password:String,
    type:String
})
const model = mongoose.model("users",schema);

module.exports= model;