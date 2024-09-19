import io from "socket.io-client";
import {createContext,useMemo,useContext} from 'react';

const sockeContext=createContext();
const getSocket=()=>useContext(sockeContext);

const SocketProvider = ({ children, loginUserDetails}) => {
    console.log(loginUserDetails?.data,'user in socket===================');
    const socket = useMemo(() => io("http://localhost:5050", {
        query: {
            loginUserDetails: JSON.stringify(loginUserDetails),  // Serialize to JSON string
          },
        withCredentials: true,
    }), []);
    return <sockeContext.Provider value={socket}>{children}</sockeContext.Provider>;
};





// const socket = io("http://localhost:5050", {
//     withCredentials: true,
// }); //we can send auth from there and can access in backend by handshake query ;

export {getSocket,SocketProvider}