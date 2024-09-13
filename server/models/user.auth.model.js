const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user_auth_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name field is required"],
  },
  email: {
    type: String,
    required: [true, "email field is required"],
  },
  password: {
    type: String,
    required: [true, "password field is required"],
  },
  bio:{
    type:String,
    required:[true,'bio is required']
  }
},{timestamps:true});



//bcrypt passWord
user_auth_Schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  }
});

//compare password
user_auth_Schema.methods.compare_password=async function(password){
   return await bcryptjs.compare(password,this.password);
}

//method to create access_token
user_auth_Schema.methods.access_token = async function () {
  return await jwt.sign(
    { _id: this._id, email: this.email },
    process.env.access_token_secret_key,
    { expiresIn: process.env.access_token_expire }
  );
};

//method to create refresh token
user_auth_Schema.methods.refresh_token = async function () {
  return await jwt.sign(
    { _id: this._id, email: this.email },
    process.env.refresh_token_secret_key,
    { expiresIn: process.env.refresh_token_expire }
  );
};

const userAuthModel=new  mongoose.model("users", user_auth_Schema);
module.exports=userAuthModel