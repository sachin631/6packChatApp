const express = require("express");
require("./connection/connection");
const user_auth_router = require("./router/user.auth.routes");
const app = express();
require("dotenv").config({});
const PORT = process.env.PORT;
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const setup_socket=require('./socket');
// const moment = require("moment/moment");

//basic middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's domain
  credentials: true, // Allow credentials (cookies) to be sent
}));
app.use(cookie_parser());


//Application Middlewares
app.use("/api/v1/", user_auth_router);

//server connection
const server=app.listen(PORT, () => {
  console.log(`server are started at ${PORT}`);
});
 
setup_socket(server);
