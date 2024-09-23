"use client";
import Image from "next/image";
import Nav from "./component/nav";
import Chat from "./component/Home";
import { SocketProvider } from "@/socket";
import axios_client from "./lib/axio.lib";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";

export default function Home() {
  const router=useRouter();
  const [loginUserDetails, setLoginUserDetails] = useState(null);
  useEffect(() => {
    const fetchLoginDetails = async () => {
      const res = await axios_client.get("/user/details");
      setLoginUserDetails(res.data);
    };
    fetchLoginDetails();
  }, []);
  if (!loginUserDetails) {
    // router.push('/login')
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <section>
      <SocketProvider loginUserDetails={loginUserDetails}>
        <Nav />
        <Chat />
      </SocketProvider>
    </section>
  );
}
