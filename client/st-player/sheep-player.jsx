import React, { useState, useEffect, useRef } from "react";

import { useSockets } from "../context/socket.context";
// import MessageField from "../molecules/message-field";
import BalloonCanvas from "./children/balloon-canvas";

const SheepPlayer = () => {
  const { socket, messages, setMessages, tmpText, setTmpText, translatedTexts, setTranslatedTexts } = useSockets();
  const messagesRef = useRef([]);
  const translatedTextsRef = useRef([]);
  useEffect(() => {
    socket.on("speechData", (data) => {
      console.log(data);
      var dataFinal = undefined || data.results[0].isFinal;
      if (dataFinal === false) {
        setTmpText(`${data.results[0].alternatives[0].transcript}`);
      } else {
        messagesRef.current = [{ text: `${data.results[0].alternatives[0].transcript}`, id: data.timeStamp }, ...messagesRef.current];
        // if (messagesRef.current.length > 5) {
        //   messagesRef.current = messagesRef.current.slice(0, 4);
        // }
        console.log(messagesRef.current);
        setMessages(messagesRef.current);
        setTmpText(``);
      }
    });

    socket.on("translate-text", ({ text, timeStamp }) => {
      // if (translatedTextsRef.current.length > 5) {
      //   translatedTextsRef.current = translatedTextsRef.current.slice(0, 4);
      // }
      translatedTextsRef.current = [{ text: text, id: timeStamp }, ...translatedTextsRef.current];
      console.log(translatedTextsRef.current);
      setTranslatedTexts(translatedTextsRef.current);
    });
  }, []);

  return (
    <div>
      {/* <MessageField /> */}
      <BalloonCanvas />
    </div>
  );
};

export default SheepPlayer;
