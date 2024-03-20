//////modules//////
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

     ////middlewares/////
const app = express();
const jwtkey = "e-comm";
app.use(cors());
app.use(express.json());

function verifytoken(req,resp,next){
    let token = req.headers['authorization'];
    if(token){
        jwt.verify(token,jwtkey,(err,valid)=>{
            if(err){
                resp.send({result:"invalid token"})
            }else{
                next();
            }
        })
    }else{
        resp.send({result:"token not found"})
    }
}

    ////files/////////
require("./dbconn");
const usermodel = require("./usersc");
const productModel = require("./productsc");
const cartmodel = require("./cartsc");
require("./cloudinary");
const upload = require("./multer");

    
app.get("/",verifytoken,(req,resp)=>{
    resp.send("hello")
});

          ///////signup-api//////
app.post("/signup",async(req,resp)=>{
let userdata = req.body;
let check =await usermodel.findOne(userdata);
if(check){
    resp.send({result:"userhai"})
}else{
    jwt.sign({userdata},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err){}
        else{
            let result = new usermodel(userdata);
            result.save();
            resp.send({userdata,auth:token})
        }
    })
}
})    

      ////signin-api////
app.post("/signin",async(req,resp)=>{
    let userdata = req.body;
    let check = await usermodel.findOne(userdata);
    if(check){
        jwt.sign({userdata},jwtkey,{expiresIn:"2h"},(err,token)=>{
            if(err){}
            else{
                if(check.type==="user"){
                    resp.send({userdata,auth:token,tyep:"user"})
                }else{
                    resp.send({userdata,auth:token,type:"admin"})
                }   
            }
        }) 
    }else{
        resp.send({result:"user nhi hai"})
    }
})   


          ////add-product-api///
app.post("/addproduct",upload.single("picture"),async(req,resp)=>{
    try{
    const result =await cloudinary.v2.uploader.upload(req.file.path);
    let data = req.body;
    let pr = new productModel({productName:data.productName,price:data.price,detail:data.detail,picture:result.secure_url});
   await pr.save();
    resp.send({result:"imageuploaded"});
    }catch(err){
        resp.send({result:"error"});
    }
})

       /////get-product-api/////
app.get("/getproduct",async(req,resp)=>{
    let data =await productModel.find();
    resp.send(data);
})  


    /////check user or admin/////
    
app.post("/checktype",async(req,resp)=>{
    let data = req.body;
     let result = await usermodel.findOne(data);
    resp.send({type:result.type});
})


     ////////cart api//////////
app.post("/cart",async(req,resp)=>{
    let data = req.body;
    let product = await productModel.findOne({_id:data.prid})
    if(product){
    let result = new cartmodel({username:data.username,productName:product.productName,price:product.price,detail:product.detail,picture:product.picture})
   let res =await result.save();
   resp.send({result:"pr"});
    }
})

     /////get cart api///////
app.post("/getcart",async(req,resp)=>{
    let data = req.body;
    let result =await cartmodel.find(data);
    resp.send(result);
})

     ////get order////
app.get("/order",async(res,resp)=>{
    let data = await cartmodel.find();
    resp.send(data);
})




          ////port////////
app.listen(1010,()=>{
    console.log("server started")
})