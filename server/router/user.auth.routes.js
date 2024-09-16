const  { user_register, user_login, user_logout, user_list, user_details, chatHistory, create_group, get_my_chat, get_my_groups, add_member_to_group } =require("../controller/user.auth.controller");
const express = require("express");
const { login_middleware } = require("../middlewares/login.middlewares")
const user_auth_router = express.Router();

user_auth_router.post("/user/register", user_register) ;
user_auth_router.post('/user/login',user_login);
user_auth_router.get('/user/logout',user_logout); 
user_auth_router.get('/user/user_list',user_list);
user_auth_router.get('/user/details',login_middleware,user_details) ;
// user_auth_router.get('/chat/history/:userId',login_middleware,chatHistory)
//chat module
user_auth_router.post('/user/create_group',login_middleware,create_group);
user_auth_router.get('/user/get_my_chat',login_middleware,get_my_chat);
user_auth_router.get('/user/get_my_group',login_middleware,get_my_groups);
user_auth_router.put('/user/add_member_to_group',login_middleware,add_member_to_group);




module.exports= user_auth_router;
