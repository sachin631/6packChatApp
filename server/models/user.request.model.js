const mongoose = require("mongoose");

const user_request_Schema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  status: {
    type: String,
    default: 3, //1 accept 2 //rejected //3 pending
  },
},{timestamps:true});

const user_request_model = new mongoose.model("request", user_request_Schema);
module.exports = user_request_model;
