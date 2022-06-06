import React, { Fragment, useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";

const MessageField = () => {
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();

  return (
    <div>
      <ul>
        {tmpText === null ? null : <li>{tmpText}</li>}
        {messages
          ? messages.map((message, index) => {
              return <li key={index}>{message}</li>;
            })
          : null}
      </ul>
    </div>
  );
};

export default MessageField;
