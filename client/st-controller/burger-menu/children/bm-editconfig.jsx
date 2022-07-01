import React, { Fragment, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../../../constant/color.js";
import { StyledBurger } from "./children/styled-burger";
import { slide as Menu } from "react-burger-menu";
import BMItemIcon from "./bm-item-icon";
import BrushSVG from "../../../atoms/brush-solid.svg?component";
import MessageSVG from "../../../atoms/message-solid.svg?component";
import { useSockets } from "../../../context/socket.context";
import { useBubbleConfig } from "../../../context/bubble-config-context";
import mojs from "@mojs/core";

const BMEditConfig = () => {
  return (
    <BMItemWrapper>
      <BMItemIcon svg={<MessageSVG />} dataTip="フキダシの形状・色・位置を変更できます" />
      <BMBubbleSelector />
    </BMItemWrapper>
  );
};

const BMBubbleSelector = () => {
  const { bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveUserConfig, configRaw } = useBubbleConfig();
  const { socket, messages, tmpText } = useSockets();
  useEffect(() => {
    // console.log(bubbleShapeList);
    if (bubbleShapeList && config) {
      const configs = configRaw.shapeData.map((item) => {
        return item.config.bubble.strokeColor;
      });
      bubbleShapeList.forEach((item, i) => {
        class Tmp extends mojs.CustomShape {
          getShape() {
            return item[0];
          }
        }
        // console.log(Tmp);
        mojs.addShape(`speechBubble${i}`, Tmp);
        new mojs.Shape({
          shape: `speechBubble${i}`,
          fill: "#fefefd",
          stroke: configs[i],
          strokeWidth: 5,
          parent: `.bubble-icon${i}`,
          origin: "0% 0%",
          top: "50px",
          left: "140%",
          scale: 0.4,
          duration: 200,
          repeat: 10000000,
        }).play();
      });
    }
  }, [bubbleShapeList, config]);

  const handleClick = (i) => {
    saveUserConfig(currentSelectedShapeId, i);
    socket.emit("selectBubble", i);
  };

  return (
    <BubbleIconsWrapper>
      {bubbleShapeList
        ? bubbleShapeList.map((item, i) => {
            return (
              <BubbleIconContainer
                key={`bubble-shape-list-${i}`}
                onClick={() => {
                  handleClick(i);
                }}
                currentBubbleShapeId={currentSelectedShapeId}
                thisBubbleShapeId={i}
              >
                <BubbleIcon className={`bubble-icon${i}`} />
              </BubbleIconContainer>
            );
          })
        : null}
    </BubbleIconsWrapper>
  );
};

const BubbleIcon = styled.div`
  position: relative;
`;

const BubbleIconContainer = styled.div`
  min-width: 13%;
  height: 50px;
  background-color: ${(props) => (props.thisBubbleShapeId === props.currentBubbleShapeId ? color.accent : color.main)};
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    opacity: ${(props) => (props.thisBubbleShapeId === props.currentBubbleShapeId ? 1 : 0.8)};
    transition: opacity 0.1s ease-in-out;
    cursor: pointer;
  }
`;

const BubbleIconsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Test = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => {
    return `${props.color}`;
  }};
`;

const Popover = styled.div`
  position: absolute;
  z-index: 2;
  left: 40px;
  top: 370px;
`;

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const BMSelectorInputWrapper = styled.div`
  position: relative;
  margin: 0em 0em 0em 0em;
  float: left;

  &::after {
    pointer-events: none; /*矢印部分をクリックを可能にする*/
    position: absolute;
    color: #2f3e4f;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%); /*▼を上に移動*/
    content: "▼";
  }
`;

const BMItemWrapper = styled.div`
  overflow: auto;
`;

export default BMEditConfig;
