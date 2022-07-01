import react, { useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";
import styled, { createGlobalStyle } from "styled-components";

const MessagedBalloon = ({ message, textAreaEditMode }) => {
  return (
    <MessageLi>
      <Message textAreaEditMode={textAreaEditMode} id="balloon-text">
        {message}
      </Message>
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
const dummy =
  "ある村に、ヒツジ飼いの男の子がいました。来る日も来る日も、仕事はヒツジの番ばかり。男の子はあきあきしてしまい、ちょっといたずらをしたくなりました。そこで男の子は、とつぜん大声をあげました。「たいへんだ！　オオカミだ。オオカミだ」村人がおどろいて、かけつけてきました。それを見て、男の子は大笑い。";
const Message = styled.span`
  ${(props) => {
    return props.textAreaEditMode ? `&::before{content:"${dummy}";}` : null;
  }}
`;

export default MessagedBalloon;
