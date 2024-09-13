import Image from "next/image";
import Nav from "./component/nav";
import Chat from "./component/Home";

export default function Home() {
  return (
    <section>
      <Nav/>
      <Chat/>
    </section>
  );
}
