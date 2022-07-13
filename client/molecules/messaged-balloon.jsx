import react, { useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";
import styled, { createGlobalStyle } from "styled-components";

const MessagedBalloon = ({ message, textAreaEditMode, translatedText, id }) => {
  return (
    <>
      <Message textAreaEditMode={textAreaEditMode} id="balloon-text">
        {message}
      </Message>
      <TranslatedText id="balloon-translated-text">{translatedText}</TranslatedText>
    </>
  );
};
const TranslatedText = styled.p`
  color: #9a9a9a;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  /* line-height: 10px; */
`;

const MessageLi = styled.div`
  margin: 10px 10px;
  list-style-type: circle;
  /* list-style-position: inside; */
  /* &:before {
    content: "> ";
  } */
`;
const dummy =
  "ある村に、ヒツジ飼いの男の子がいました。来る日も来る日も、仕事はヒツジの番ばかり。男の子はあきあきしてしまい、ちょっといたずらをしたくなりました。そこで男の子は、とつぜん大声をあげました。「たいへんだ！　オオカミだ。オオカミだ」村人がおどろいて、かけつけてきました。それを見て、男の子は大笑い。";
const Message = styled.p`
  margin: 0;
  ${(props) => {
    return props.textAreaEditMode ? `&::before{content:"${dummy}";}` : null;
  }}
`;

export default MessagedBalloon;
