"use client";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axios_client from "../lib/axio.lib";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { getSocket } from "@/socket";
import { NEW_MESSAGE } from "@/constant";

const Chat = () => {
  const [chat, setChat] = useState();
  const [chatId, setChatId] = useState();
  const [chatBox, setChatBox] = useState();
  const [loginUserDetails, setLoginUserDetails] = useState();
  const [members, setMembers] = useState();
  let socket = getSocket();
  console.log(socket, "socket...");

  //my_chat api
  const query = useQuery({
    queryKey: ["my_chat"],
    queryFn: async () => {
      const res = await axios_client.get("/user/get_my_chat");
      setChat(res.data);
      return res.data;
    },
  });

  if (query.isError) {
    toast.error(query.error.response.data.message);
  }
  if (query.isFetched) {
    // toast.success("your chat fetched successfuly");
  }

  //login_user details api
  const login_user_details = useQuery({
    queryKey: ["login_user_details"],
    queryFn: async () => {
      const res = await axios_client.get("/user/details");
      setLoginUserDetails(res.data);
      return res.data;
    },
  });
  if (login_user_details.isError) {
    return toast.error("error while fetching login user_details");
  }
console.log('chatid',chatId)
  //my_chat_details api
  const my_chat_details = useQuery({
    
    queryKey: ["my_chat_details"],
    queryFn: async () => {
      console.log(chatId, "chatId here+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      const res = await axios_client.get(`/user/chatDetails?chat_id=${chatId}`);
      setMembers(res?.data?.data[0]);
      return res.data;
    },
    enabled: !!chatId,
  });
console.log(members,'members details of my_chat detaisl')
  if (my_chat_details.isError) {
    return toast.error(error.response.data.message);
  }

  const userJoinDate = loginUserDetails?.data?.createdAt;
  const now_date = moment();
  const days_deff = now_date.diff(userJoinDate, "days");
  return (
    <div className="h-[70vh]">
      <section className="flex ga-4 mt-8 h-[80vh]">
        {/*sidebar section start here  */}
        <div className="overflow-auto flex flex-col gap-2 px-3 py-3 border-solid border-black bg-blue-500 text-white cursor-pointer border-2 w-[20vw] text-center">
          {chat?.data?.map((curelem) => {
            return (
              <Button
                variant="contained"
                onClick={() => setChatId(curelem._id)}
              >
                {curelem.display_name}
              </Button>
            );
          })}
        </div>
        {/*sidebar section start here  */}

        {/* chat box start here */}
        <div className="border-black border-2 w-[60vw] overflow-auto">
          <div className="bg-white  px-4 py-4 text-black ">
            <div className=" border-black border-2 w-[20%] px-4">
              <div>user_name</div>
              <div>message_text</div>
              <div>time of message</div>
            </div>
          </div>
          <div className="bg-white  px-4 py-4 text-black ">
            <div className=" border-black border-2 w-[20%] px-4">
              <div>user_name</div>
              <div>message_text</div>
              <div>time of message</div>
            </div>
          </div>
          {/*  */}
          <div className="bg-white  px-4 py-4 text-black flex justify-end">
            <div className=" border-black border-2 w-[20%] px-4 ">
              <div>user_name</div>
              <div>message_text</div>
              <div>time of message</div>
            </div>
          </div>
          <div className="bg-white  px-4 py-4 text-black flex justify-end">
            <div className=" border-black border-2 w-[20%] px-4 ">
              <div>user_name</div>
              <div>message_text</div>
              <div>time of message</div>
            </div>
          </div>
          <div className="bg-white  px-4 py-4 text-black flex justify-end">
            <div className=" border-black border-2 w-[20%] px-4 ">
              <div>user_name</div>
              <div>message_text</div>
              <div>time of message</div>
            </div>
          </div>
          <form className=" ">
            <div className="flex rounded-md">
              <input
                type="text"
                placeholder="type message here"
                className=" bg-blue-500 w-[100%] h-[100px] px-4 "
                value={chatBox}
                onChange={(event) => setChatBox(event.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                onClick={(event) => {
                  console.log('hello')
                  event.preventDefault();
                  socket.emit(NEW_MESSAGE, { chatId, members:members.members, message:chatBox });
                  setChatBox("");
                }}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
        {/* chat box end  here */}

        {/* //profile view start here*/}
        <div className="w-[20vw] border-black border-2 text-center">
          <div className="">{loginUserDetails?.data?.name}</div>
          <div>{loginUserDetails?.data?.email}</div>
          <div>{loginUserDetails?.data?.bio}</div>
          <div>
            <div>joined {days_deff} days ago</div>
          </div>
        </div>
        {/* //profile view end here*/}
      </section>
    </div>
  );
};

export default Chat;
