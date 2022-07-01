import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSockets } from "../context/socket.context";
import MessagedBalloon from "./messaged-balloon";
import styled from "styled-components";
import mojs from "@mojs/core";
import { useBubbleConfig } from "../context/bubble-config-context";
import color from "../constant/color";

const MessageField = () => {
  const textContentRef = useRef();
  const playAnimationObjectRef = useRef();
  const [localFonts, setLocalFonts] = useState([]);
  const { socket, messages, tmpText } = useSockets();
  const colorRef = useRef("");
  const { bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveUserConfig } = useBubbleConfig();
  const bubbleClassRef = useRef("");
  const [startAnimProcess, setStartAnimProcess] = useState(false);
  const bubbleRef = useRef("");
  const [renderSkip, setRenderSkip] = useState(false);
  const [textAreaEditMode, setTextAreaEditMode] = useState(false);

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

    socket.on("toggleAnimation", (data) => {
      if (data === "play") {
        playAnimationObjectRef.current.replay();
      } else if (data === "pause") {
        playAnimationObjectRef.current.pause();
      }
    });

    socket.on("toggleTextAreaEditMode", (status) => {
      setTextAreaEditMode(status);
    });
  }, []);

  useEffect(() => {
    // console.log("message field側でもOK");
    // console.log(currentSelectedShapeId);
  }, [currentSelectedShapeId]);

  useEffect(() => {
    if (bubbleShapeList !== null && config !== null) {
      setStartAnimProcess(true);
    }
  }, [bubbleShapeList, config]);

  // フキダシ変更のためリロード処理
  useEffect(() => {
    if (startAnimProcess) {
      // console.log(`speechBubble${currentSelectedShapeId}へ変更するよ`);
      window.location.reload();
    }
  }, [currentSelectedShapeId]);

  useEffect(() => {
    console.log("now editing", textAreaEditMode);
    if (startAnimProcess) {
      if (!textAreaEditMode) {
        if (!renderSkip) {
          setRenderSkip(true);
          playAnimationObjectRef.current.tuneReplay({
            shape: `speechBubble${currentSelectedShapeId}`,
            fill: "#fefefd",
            stroke: config.config.bubble.strokeColor,
            strokeWidth: config.config.bubble.strokeWidth,
            parent: "#bubble-container",
            top: `${config.config.bubble.y}`,
            left: `${config.config.bubble.x}`,
            rotate: `${config.config.bubble.rotate}`,
            origin: "50% 50%",
            scale: { [config.config.bubble.scale]: config.config.bubble.scale + 0.05 / config.config.bubble.scale, easing: "cubic.out" },
            duration: 200,
            easing: "cubic.out",
            repeat: 10000000,
            isYoyo: true,
          });
        }
      }
    }
  }, [config]);

  // フキダシの読み込みと初回shapeIDでレンダリング
  useEffect(() => {
    if (startAnimProcess) {
      bubbleShapeList.forEach((item, i) => {
        class Tmp extends bubbleClassRef.current {
          getShape() {
            return item[0];
          }
        }

        // console.log(Tmp);
        mojs.addShape(`speechBubble${i}`, Tmp);
      });

      const speechBubble = new mojs.Shape({
        shape: `speechBubble${currentSelectedShapeId}`,
        fill: "#fefefd",
        stroke: config.config.bubble.strokeColor,
        parent: "#bubble-container",
        strokeWidth: config.config.bubble.strokeWidth,
        top: `${config.config.bubble.y}`,
        left: `${config.config.bubble.x}`,
        origin: "50% 50%",
        rotate: `${config.config.bubble.rotate}`,
        scale: { [config.config.bubble.scale]: config.config.bubble.scale + 0.05 / config.config.bubble.scale, easing: "cubic.out" },
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
        tuneReplay: (newConfig) => {
          speechBubble.tune(newConfig).replay();
          window.setTimeout(() => {
            speechBubble.pause();
            setRenderSkip(false);
          }, 100);
        },
      };
      playAnimationObjectRef.current = animationController;
    }
  }, [startAnimProcess]);

  return (
    <div>
      <div id="bubble-container"></div>
      <TextMessage id="text-message" config={config} textAreaEditMode={textAreaEditMode}>
        <div ref={textContentRef}>
          <UlStyle>
            {tmpText === null ? null : <MessagedBalloon message={tmpText} textAreaEditMode={textAreaEditMode} />}
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

const TextMessage = styled.div`
  ${(props) => {
    const config = props.config;
    if (config) {
      return `
      background-color: ${props.textAreaEditMode ? color.main : "none"};
      opacity: ${props.textAreaEditMode ? "0.7" : "1"};      
      transition:background-color .4s;
      padding:0 1rem;
  width: ${config.config.textArea.width}px;
  height: ${config.config.textArea.height}px;
  top: ${config.config.textArea.y}px;
  left: ${config.config.textArea.x}px;
  transform:rotate(${config.config.textArea.rotate}deg);
  border-radius:20px;
  position: absolute;
  transform-origin: 50% 140%;
  div {
    font-size: ${config.config.textArea.fontSize}px;
    position: absolute; /*自由に配置する指定*/
    bottom: 0; /*下寄せの指定*/
    right: 0;
    margin: 0;
    word-wrap: break-word;
    overflow-y: auto;
    width: ${config.config.textArea.width}px;
    height: ${config.config.textArea.height}px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
    }
  }};
`;

export default MessageField;
