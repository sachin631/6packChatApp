"use client";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios_client from "../lib/axio.lib";
import "react-toastify/dist/ReactToastify.css";

const Nav = () => {
  let router = useRouter();
  const [search, setSearch] = useState();
  const [name, setName] = useState("");
  const [myNotification, setMyNotification] = useState();

  let queryClient = useQueryClient();
  let on_logout = async () => {
    logout_mutaution.mutate();
  };

  const logout_mutaution = useMutation({
    mutationFn: async () => {
      const res = await axios_client.get("/user/logout");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Logout successfully");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },

    onError: (error) => {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  let on_search_change = async (event) => {
    setName(event.target.value);
  };

  const query = useQuery({
    queryKey: ["search_user"],
    queryFn: async (data) => {
      const res = await axios_client.get("/user/search_user", {
        params: {
          name: name, // send name as query parameter
        },
      });
      setSearch(res.data);
      return res.data;
    },
  });

  if (query.isError) {
    toast.error(query.error.response.data.message);
  }

  let on_send_request = async (receiver_id) => {
    send_friend_request_mutation.mutate(receiver_id);
  };
  //send_friend_request
  const send_friend_request_mutation = useMutation({
    mutationFn: async (receiver_id) => {
      const res = await axios_client.post("/user/send_friend_request", {
        receiver_id: receiver_id,
      });
      return res?.data;
    },
    onSuccess: () => {
      toast.success("friend request send successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  //user/getNotification api
  const my_notification_query = useQuery({
    queryKey: ["my_notification"],
    queryFn: async () => {
      const res = await axios_client.get("/user/getNotification");
      setMyNotification(res.data);
      return res?.data;
    },
  });
  if (my_notification_query.isError) {
    toast.error(my_notification_query.error.response.data.message);
  }
  console.log(myNotification, "myNotificationmyNotification");

  return (
    <div>
      <section className="flex justify-between">
        <Button
          variant="contained"
          onClick={() => {
            router.push("/");
          }}
        >
          Logo
        </Button>
        <div className="flex gap-2">
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  search
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <h1 className="text-2xl">Search</h1>
                    <input
                      type="text"
                      className="m-4 border-solid border-2 border-black rounded px-3"
                      placeholder="find user and send req "
                      onChange={on_search_change}
                    />
                    <div className="flex flex-col gap-4 h-[30vh]">
                      {search?.data?.map((curelem) => {
                        return (
                          <div className="flex gap-4 justify-center items-center">
                            <div className="">{curelem.name}</div>
                            <Button
                              variant="contained"
                              onClick={() => on_send_request(curelem?._id)}
                            >
                              send request
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </Typography>
                </Popover>
              </div>
            )}
          </PopupState>

          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  create Group
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <h1 className="text-2xl">New group</h1>
                    <input
                      type="text"
                      className="m-4 border-solid border-2 border-black rounded px-3"
                      placeholder="group name "
                    />
                    <div className="flex flex-col gap-4 h-[30vh]">
                      <div className="flex gap-4 justify-center items-center">
                        <div>user1</div>
                        <Button variant="contained">Add</Button>
                      </div>
                      <div className="flex gap-4 justify-center items-center">
                        <div>user1</div>
                        <Button variant="contained">Add</Button>
                      </div>
                      <div className="flex gap-4 justify-center items-center">
                        <div>user1</div>
                        <Button variant="contained">Add</Button>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Button
                        variant="contained"
                        className="flex justify-center items-center"
                      >
                        Create
                      </Button>
                    </div>
                  </Typography>
                </Popover>
              </div>
            )}
          </PopupState>

          <Button
            variant="contained"
            onClick={() => {
              router.push("/groups");
            }}
          >
            My Groups
          </Button>

          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  Notifications
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <h1 className="text-2xl">My notifications</h1>

                    <div className="flex flex-col gap-4 h-[30vh]">
                      <div className="flex gap-4 justify-center items-center">
                        {myNotification?.data.map((curelem) => {
                          return (
                            <div className="flex gap-4 justify-center items-center">
                              <div className="text-center">{curelem.sender.name} sent you friend request</div>
                              <Button variant="contained">Accept</Button>
                              <Button
                                variant="contained"
                                className="bg-red-500"
                              >
                                Reject
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  
                  </Typography>
                </Popover>
              </div>
            )}
          </PopupState>
          <Button variant="contained" onClick={on_logout}>
            exit
          </Button>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Nav;
