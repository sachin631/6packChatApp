const { user_register, user_login, user_logout, user_list,
    user_details, chatHistory, create_group, get_my_chat, get_my_groups,
    add_member_to_group, remove_member, leave_group, chatDetails, delete_chat, search_user, 
    send_friend_request,
    accept_friend_request,
    getNotification,
    get_my_friends} = require("../controller/user.auth.controller");

const express = require("express");
const { login_middleware } = require("../middlewares/login.middlewares")
const user_auth_router = express.Router();

user_auth_router.post("/user/register", user_register);//done
user_auth_router.post('/user/login', user_login); //done
user_auth_router.get('/user/logout', user_logout); //done
user_auth_router.get('/user/user_list', user_list); 
user_auth_router.get('/user/details', login_middleware, user_details);//done
user_auth_router.get('/user/search_user', login_middleware, search_user); //done
user_auth_router.post('/user/send_friend_request',login_middleware,send_friend_request);
user_auth_router.post('/user/accept_friend_request',login_middleware,accept_friend_request);
user_auth_router.get('/user/getNotification',login_middleware,getNotification) ;
user_auth_router.get('/user/get_my_friends',login_middleware,get_my_friends);
// user_auth_router.get('/chat/history/:userId',login_middleware,chatHistory)
//chat module
user_auth_router.post('/user/create_group', login_middleware, create_group);
user_auth_router.get('/user/get_my_chat', login_middleware, get_my_chat);
user_auth_router.get('/user/get_my_group', login_middleware, get_my_groups);
user_auth_router.put('/user/add_member_to_group', login_middleware, add_member_to_group);
user_auth_router.delete('/user/remove_member', login_middleware, remove_member);
user_auth_router.delete('/user/leave_group/:group_id', login_middleware, leave_group);
user_auth_router.get('/user/chatDetails/:chat_id', login_middleware, chatDetails);
user_auth_router.delete('/user/delete_chat/:chat_id', login_middleware, delete_chat);
//get messgaes of particular chat by chat _id




module.exports = user_auth_router;
