"use client";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axios_client from "../lib/axio.lib";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { getSocket } from "@/socket";
import { NEW_MESSAGE } from "@/constant";

const Chat = () => {
  const [chat, setChat] = useState();
  const [chatId, setChatId] = useState();
  const [chatBox, setChatBox] = useState();
  const [loginUserDetails, setLoginUserDetails] = useState();
  const [members, setMembers] = useState();
  const [RealMessages, setRealMessages] = useState([]); // Initialize as an empty array
  const [ChatHistory,setChatHistory]=useState([]);
  let socket = getSocket();

  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log(data);
      setRealMessages((prevMessages) => [...prevMessages, data]); // Append the new message to the list
    };

    socket.on(NEW_MESSAGE, handleNewMessage);

    // Cleanup to avoid duplicate event listeners
    return () => {
      socket.off(NEW_MESSAGE, handleNewMessage);
    };
  }, [socket]);

  // my_chat api //sidebar chat
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

  // login_user details api
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

  // my_chat_details api
  const my_chat_details = useQuery({
    queryKey: ["my_chat_details"],
    queryFn: async () => {
      const res = await axios_client.get(`/user/chatDetails?chat_id=${chatId}`);
      setMembers(res?.data?.data[0]);
      return res.data;
    },
    enabled: !!chatId,
  });

  if (my_chat_details.isError) {
    return toast.error(my_chat_details.error.response.data.message);
  }

  const chat_history=useQuery({
    queryKey:['chat_history'],
    queryFn:async()=>{
      const res=await axios_client.get(`/user/chathistory?chat_id=${chatId}`);
      setChatHistory(res.data);
      return res.data;
    }

  });

  if(chat_history.isError){
    return <div>{error.response.data.message}</div>
  }
console.log(ChatHistory,"chatHostory working")
  const userJoinDate = loginUserDetails?.data?.createdAt;
  const now_date = moment();
  const days_deff = now_date.diff(userJoinDate, "days");

  return (
    <div className="h-[70vh]">
      <section className="flex ga-4 mt-8 h-[80vh]">
        {/* Sidebar section */}
        <div className="overflow-auto flex flex-col gap-2 px-3 py-3 border-solid border-black bg-blue-500 text-white cursor-pointer border-2 w-[20vw] text-center">
          {chat?.data?.map((curelem) => (
            <Button
              key={curelem._id}
              variant="contained"
              onClick={() => setChatId(curelem._id)}
            >
              {curelem.is_group_chat
                ? curelem.display_name
                : curelem.members[0].name}
            </Button>
          ))}
        </div>

        {/* Chat box */}
        <div className="border-black border-2 w-[60vw] overflow-auto">
          <div className="bg-blue-500 text-white  px-4 py-4 flex flex-col gap-4">
            {RealMessages?.length > 0 ? (
              RealMessages.map((message, i) => (
                <div key={i} className="message mb-9 ">
                  <div className="border-black border-2 w-[20%] px-4 flex flex-col">
                    <div>
                      <strong>{message?.sender?.name}</strong>
                    </div>
                    <div className="text-bl">{message?.content}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No messages yet...</div>
            )}
          </div>
          <form
            className="bottom-5 fixed w-[57%]"
            onSubmit={(event) => {
              event.preventDefault();
              socket.emit(NEW_MESSAGE, {
                chatId,
                members: members?.members,
                message: chatBox,
              });
              setChatBox(""); // Clear input after sending the message
            }}
          >
            <div className="flex rounded-md">
              <input
                type="text"
                placeholder="Type message here"
                className=" bg-blue-500 w-[100%] h-[100px] px-4 "
                value={chatBox}
                onChange={(event) => setChatBox(event.target.value)}
              />
              <Button type="submit" variant="contained">
                Send
              </Button>
            </div>
          </form>
        </div>

        {/* Profile section */}
        <div className="w-[20vw] border-black border-2 text-center">
          <div className="">NAME: {loginUserDetails?.data?.name}</div>
          <div>EMAIL: {loginUserDetails?.data?.email}</div>
          <div>BIO: {loginUserDetails?.data?.bio}</div>
          <div>
            <div>Joined {days_deff} days ago</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
