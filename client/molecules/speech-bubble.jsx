import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSockets } from "../context/socket.context";
import MessagedBalloon from "../molecules/messaged-balloon";
import styled from "styled-components";
import mojs from "@mojs/core";
import { useBubbleConfig } from "../context/bubble-config-context";

const SpeechBubble = () => {
  const textContentRef = useRef();
  const playAnimationObjectRef = useRef();
  const [localFonts, setLocalFonts] = useState([]);
  const { socket, messages, tmpText } = useSockets();
  const colorRef = useRef("");
  const { bubbleShapeList, setBubbleShapeList, config, currentSelectedShapeId, saveUserConfig } = useBubbleConfig();
  const bubbleClassRef = useRef("");
  const [startAnimProcess, setStartAnimProcess] = useState(false);
  const bubblePathArrayRef = useRef("");
  // const svg
  //bubbleConfig { shapeId: 1, strokeColor: color.main, x: 0, y: 0, width: "310px", height: "240px", fontSize: "22px" }
  class SpeechBubble extends mojs.CustomShape {
    getShape() {
      return;
    }
    getLength() {
      return 200;
    } // optional
  }

  useEffect(() => {
    bubbleClassRef.current = SpeechBubble;
    socket.emit("getFontList");
    socket.on("getFontList", (fonts) => {
      setLocalFonts(fonts);
      socket.emit("select-font", fonts[0]);
    });

    socket.emit("getSvgList");
    socket.on("getSvgList", (svgs) => {
      bubblePathArrayRef.current = svgs;
      setStartAnimProcess(true);
    });

    socket.on("toggleAnimation", (data) => {
      if (data === "play") {
        playAnimationObjectRef.current.replay();
      } else if (data === "pause") {
        playAnimationObjectRef.current.pause();
      }
    });
    // socket.on("bubbleConfigUpdate", (config) => {
    //   colorRef.current = config.strokeColor;
    //   playAnimationObjectRef.current.tuneReplay({ stroke: colorRef.current });
    //   window.setTimeout(() => {
    //     playAnimationObjectRef.current.pause();
    //   }, 100);
    // });
  }, []);

  useEffect(() => {
    if (startAnimProcess) {
      // passing name and Bubble class
      // now it is avaliable on mojs.Shape constructor as usual

      bubblePathArrayRef.current.forEach((item, i) => {
        class Tmp extends bubbleClassRef.current {
          getShape() {
            return item[0];
          }
        }

        mojs.addShape(`speechBubble${i}`, Tmp);
      });

      const speechBubble = new mojs.Shape({
        shape: "speechBubble0",
        fill: "#fefefd",
        stroke: config.config.bubble.strokeColor,
        parent: "#bubble-container",
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
        tuneReplay: (config) => {
          speechBubble.tune(config).replay();
        },
      };
      playAnimationObjectRef.current = animationController;
    }
  }, [startAnimProcess]);

  return (
    <div>
      <div id="bubble-container"></div>
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
