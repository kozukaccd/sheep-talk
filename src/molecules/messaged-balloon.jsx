import react, { useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";
import styled, { createGlobalStyle } from "styled-components";

const MessagedBalloon = ({ message }) => {
  return (
    <MessageLi>
      <Message id="balloon-text">{message}</Message>
    </MessageLi>
  );
};

const MessageLi = styled.li`
  margin: 10px 10px;
  list-style-type: circle;
  /* list-style-position: inside; */
  /* &:before {
    content: "> ";
  } */
`;

const Message = styled.span``;

export default MessagedBalloon;
