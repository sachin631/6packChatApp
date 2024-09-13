const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/chatApplication");
    console.log("db connected successfully");
  } catch (err) {
    console.log(err.message);
  }
})();
