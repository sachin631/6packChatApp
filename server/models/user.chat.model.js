const mongoose = require("mongoose");


const user_chat_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name field is required"],
  },
  is_group_chat: {
    type: Boolean,
    default:false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  members:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
  ],
},{timestamps:true});

const user_chat_model=new  mongoose.model("chat", user_chat_Schema);
module.exports=user_chat_model