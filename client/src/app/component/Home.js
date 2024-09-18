"use client";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axios_client from "../lib/axio.lib";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";

const Chat = () => {
  const [chat, setChat] = useState();
  const [loginUserDetails, setLoginUserDetails] = useState();

  console.log(moment().utc(), "moment=....");
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

  const userJoinDate = loginUserDetails?.data?.createdAt;
  const now_date = moment();
  const days_deff = now_date.diff(userJoinDate, "days");

  return (
    <div className="h-[70vh]">
      <section className="flex ga-4 mt-8 h-[80vh]">
        <div className="overflow-auto flex flex-col gap-2 px-3 py-3 border-solid border-black bg-blue-500 text-white cursor-pointer border-2 w-[20vw] text-center">
          {chat?.data?.map((curelem) => {
            return <div>{curelem.display_name}</div>;
          })}
        </div>
        {/* chat box */}
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
                placeholder="message"
                className=" bg-[brown] w-[100%] h-[100px] px-4 rounded-md"
              />
              <Button type="submit" variant="contained" className="rounded-md">
                Send
              </Button>
            </div>
          </form>
        </div>
        {/* //profile view */}

        <div className="w-[20vw] border-black border-2 text-center">
          <div className="">{loginUserDetails?.data?.name}</div>
          <div>{loginUserDetails?.data?.email}</div>
          <div>{loginUserDetails?.data?.bio}</div>
          <div>
            <div>joined {days_deff} days ago</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
