import React, { Fragment, useState, useEffect, useRef } from "react";
import { useBubbleConfig } from "../../context/bubble-config-context";
import { useSockets } from "../../context/socket.context";
import styled from "styled-components";
import MessagedBalloon from "../../molecules/messaged-balloon";
import color from "../../constant/color";
const BalloonCanvas = () => {
  const { bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveUserConfig } = useBubbleConfig();
  const [test, setTest] = useState(null);
  const [scaleProp, setScaleProp] = useState(4);
  const { socket, messages, tmpText } = useSockets();
  const textContentRef = useRef();
  const [textAreaEditMode, setTextAreaEditMode] = useState(false);

  useEffect(() => {
    if (bubbleShapeList) {
      console.log(bubbleShapeList);
      setTest(
        bubbleShapeList.map((item) => {
          return `<svg width="100" height="100" paint-order="stroke" viewbox="-20 -20 130 130"   stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${item}</svg>`;
        })
      );
    }
  }, [bubbleShapeList]);

  useEffect(() => {
    socket.on("toggleTextAreaEditMode", (status) => {
      setTextAreaEditMode(status);
    });
  }, []);

  return (
    <>
      {test ? <Fragment>{config ? <SVGWrapper config={config} dangerouslySetInnerHTML={{ __html: test[currentSelectedShapeId] }} /> : null}</Fragment> : null}
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
    </>
  );
};

const SVGWrapper = styled.div`
  transition: all 0.1s ease-out;
  position: absolute;
  left: ${(props) => props.config.config.bubble.x}px;
  top: ${(props) => props.config.config.bubble.y}px;
  transform-origin: 50% 50%;
  transform: scale(${(props) => props.config.config.bubble.scale}) rotate(${(props) => props.config.config.bubble.rotate}deg);
  text-align: center;
  svg {
    width: ${(props) => props.config.config.bubble.scale * 100}px;
    height: ${(props) => props.config.config.bubble.scale * 100}px;
    stroke: ${(props) => props.config.config.bubble.strokeColor};
    stroke-width: ${(props) => props.config.config.bubble.strokeWidth};
    fill: white;
  }
`;

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
      transition:all .1s;      
      padding:0 1rem;
  width: ${config.config.textArea.width}px;
  height: ${config.config.textArea.height}px;
  top: ${config.config.textArea.y}px;
  left: ${config.config.textArea.x}px;
  transform:rotate(${config.config.textArea.rotate}deg);
  border-radius:20px;
  position: absolute;
  transform-origin: 50% 50%;
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

export default BalloonCanvas;
