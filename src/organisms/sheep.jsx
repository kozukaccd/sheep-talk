import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Recording from "../molecules/recording";
import { useSockets } from "../context/socket.context";
import MessageField from "../molecules/message-field";

const Sheep = () => {
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();

  const messageRef = useRef(null);

  const handleClick = () => {
    const message = messageRef.current.value;
    if (!String(message).trim()) return;
    socket.emit("sendMessage", message);
    messageRef.current.value = "";
  };

  socket.on("speechData", (data) => {
    var dataFinal = undefined || data.results[0].isFinal;
    if (dataFinal === false) {
      setTmpText(`▼ ${data.results[0].alternatives[0].transcript}`);
    } else {
      setTmpText(`▼ `);
      setMessages([tmpText, ...messages]);
    }
  });

  return (
    <div>
      <MessageField />
    </div>
  );
};

export default Sheep;
