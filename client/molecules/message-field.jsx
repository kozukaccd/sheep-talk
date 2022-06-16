import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSockets } from "../context/socket.context";
import MessagedBalloon from "../molecules/messaged-balloon";
import styled from "styled-components";
import mojs from "@mojs/core";
import { useBubbleConfig } from "../context/bubble-config-context";
class SpeechBubble extends mojs.CustomShape {
  getShape() {
    return `<path class="cls-1" d="M12.92,65.49,1.09,27.61a6.92,6.92,0,0,1,2.29-7.5L25.72,2.29A6.93,6.93,0,0,1,30.61.79L77.05,4.54a7,7,0,0,1,6.39,7.16L81.87,56.2a6.92,6.92,0,0,1-6,6.64L55.58,65.52,46.34,79.07l-1.53-12L20.47,70.3A7,7,0,0,1,12.92,65.49Z"/>`;
  }
  getLength() {
    return 200;
  } // optional
}

const MessageField = () => {
  const textContentRef = useRef();
  const playAnimationObjectRef = useRef();
  const [localFonts, setLocalFonts] = useState([]);
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  const [isPlaying, setIsPlaying] = useState(false);

  const { bubbleShapeList, setBubbleShapeList, bubbleConfig, setBubbleConfig } = useBubbleConfig();
  //bubbleConfig { shapeId: 1, strokeColor: color.main, x: 0, y: 0, width: "310px", height: "240px", fontSize: "22px" }

  useEffect(() => {
    socket.emit("getFontList");
    socket.on("getFontlist", (fonts) => {
      setLocalFonts(fonts);
      socket.emit("select-font", fonts[0]);
    });
    socket.on("toggleAnimation", (data) => {
      if (data === "play") {
        playAnimationObjectRef.current.replay();
      } else if (data === "pause") {
        playAnimationObjectRef.current.pause();
      }
    });
    socket.on("bubbleConfigUpdate", (config) => {
      console.log("config updated");
    });
  }, []);

  useEffect(() => {
    const textMessage = new mojs.Html({
      el: "#text-message",
      scale: 1,
      // scale: { 1: 1.02, duration: 100, easing: "cubic.out", repeat: 10000000, isYoyo: true },
    }); // textMessage.pause(); // textMessage.play();

    mojs.addShape("speechBubble", SpeechBubble); // passing name and Bubble class
    // now it is avaliable on mojs.Shape constructor as usual
    const speechBubble = new mojs.Shape({
      shape: "speechBubble",
      fill: "#fefefd",
      stroke: "#5ab690",
      parent: "#bouncyCircle",
      top: "690px",
      left: "920px",
      origin: "50% 100%",
      scale: { 5: 5.1, easing: "cubic.out" },
      duration: 200,
      easing: "cubic.out",
      repeat: 10000000,
      isYoyo: true,
    });

    speechBubble.play();
    window.setTimeout(() => {
      speechBubble.pause();
    }, 100);

    const animationController = {
      replay: () => {
        speechBubble.replay();
      },
      pause: () => {
        speechBubble.pause();
      },
      play: () => {
        speechBubble.play();
      },
    };
    playAnimationObjectRef.current = animationController;
    // playAnimationObjectRef.current.play();
    // playAnimationObjectRef.current.pause();
  }, []);

  return (
    <div>
      <div id="bouncyCircle"></div>
      <TextMessage id="text-message">
        <div ref={textContentRef}>
          <UlStyle>
            {tmpText === null ? null : <MessagedBalloon message={tmpText} />}
            {messages
              ? messages.map((message, index) => {
                  return <MessagedBalloon message={message} />;
                })
              : null}
          </UlStyle>
        </div>
      </TextMessage>
    </div>
  );
};

// {tmpText === null ? null : <MessagedBalloon message={tmpText} />}

const UlStyle = styled.ul`
  list-style-type: none;
  padding-left: 14px;
`;

const textAreaSizeX = "310px";
const textAreaSizeY = "240px";
const TextMessage = styled.div`
  /* background-color: #aaaaaa; */
  width: ${textAreaSizeX};
  height: ${textAreaSizeY};
  top: 286px;
  left: 741px;
  position: absolute;
  transform-origin: 50% 140%;
  div {
    font-size: 22px;
    position: absolute; /*自由に配置する指定*/
    bottom: 0; /*下寄せの指定*/
    right: 0;
    margin: 0;
    word-wrap: break-word;
    overflow-y: auto;
    width: ${textAreaSizeX};
    height: ${textAreaSizeY};
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
export default MessageField;
