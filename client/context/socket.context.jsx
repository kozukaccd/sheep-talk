import { useContext, createContext, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
// import { SOCKET_URL } from "./config/default";
// import EVENTS from "./config/events";

//SOCKET_URLの中身のところに接続を要求
const socket = io("http://localhost:5098/");

const SocketContext = createContext({
  socket,
  setUsername: () => false,
  setMessages: () => false,
});

const SocketsProvier = (props) => {
  const [messages, setMessages] = useState([]);
  const [tmpText, setTmpText] = useState(``);

  return <SocketContext.Provider value={{ socket, messages, setMessages, tmpText, setTmpText }} {...props} />;
};

export const useSockets = () => useContext(SocketContext);

export default SocketsProvier;
