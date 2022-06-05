import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Recording from "../molecules/recording";
import { useSockets } from "../context/socket.context";

const TextField = () => {
  const { socket } = useSockets();
  const messageRef = useRef(null);
  const [messages, setMessages] = useState([]);

  console.log(messages);

  const handleClick = () => {
    const message = messageRef.current.value;
    if (!String(message).trim()) return;
    socket.emit("sendMessage", message);
    messageRef.current.value = "";
  };

  socket.on("responseMessage", (message) => {
    setMessages([...messages, message]);
  });

  return (
    <div>
      <input type="text" ref={messageRef} placeholder="write message" />
      <Recording />
    </div>
  );
};

export default TextField;
