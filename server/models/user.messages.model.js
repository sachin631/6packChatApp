const mongoose = require("mongoose");


const user_message_Schema = new mongoose.Schema({
  content: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'chat'
  },
 
},{timestamps:true});

const user_message_model=new  mongoose.model("message", user_message_Schema);
module.exports=user_message_model