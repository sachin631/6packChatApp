import { Button } from "@mui/material";
import React from "react";

const Chat = () => {
  return (
    <div className="h-[70vh]">
      <section className="flex ga-4 mt-8 h-[80vh]">
        <div className="overflow-auto flex flex-col gap-2 px-3 py-3 border-solid border-black bg-blue-500 text-white cursor-pointer border-2 w-[20vw] text-center">
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
          <div>user1</div>
          <div>user2</div>
          <div>user3</div>
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
              <Button type="submit" variant="contained" className="rounded-md">Send</Button>
            </div>
          </form>
        </div>
        {/* //profile view */}
        <div className="w-[20vw] border-black border-2 text-center">
          <div className="">user_Bio</div>
          <div>user_email</div>
          <div>user_name</div>
          <div>
            <div>4month ago</div>
            <div>joined</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
