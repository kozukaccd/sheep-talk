import React, { Fragment, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../../../constant/color.js";
import { StyledBurger } from "./children/styled-burger";
import { slide as Menu } from "react-burger-menu";
import BMItemIcon from "./bm-item-icon";
import BrushSVG from "../../../atoms/brush-solid.svg?component";
import MessageSVG from "../../../atoms/message-solid.svg?component";
import { useSockets } from "../../../context/socket.context";
import { TwitterPicker as Color } from "react-color";
import { useBubbleConfig } from "../../../context/bubble-config-context";
import mojs from "@mojs/core";

const BMEditColor = () => {
  return (
    <BMItemWrapper>
      {/* <BMItemIcon svg={<BrushSVG />} dataTip="フキダシの色を変更できます" /> */}
      <BMColorSelector />
    </BMItemWrapper>
  );
};

const BMColorSelector = () => {
  const [localFonts, setLocalFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("");
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  const [strokeColor, setStrokeColor] = useState(color.main);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const { bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveUserConfig } = useBubbleConfig();
  //bubbleConfig { shapeId: 1, strokeColor: color.main, x: 0, y: 0, width: "310px", height: "240px", fontSize: "22px" }

  useEffect(() => {}, []);

  useEffect(() => {
    if (config) {
      const tmp = { ...config };
      tmp.config.bubble.strokeColor = strokeColor;
      socket.emit("bubbleConfigUpdate", tmp);
    }
  }, [strokeColor]);

  const handleSelectedFontChange = (e) => setSelectedFont(e.target.value);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (input) => {
    setStrokeColor(input.hex);
  };

  const colorArray = ["#83C9C9", "#57bd88", "#439137", "#e3d042", "#BE5A34", "#9C3740", "#A067A7", "#5300EB", "#EB9694", "#FAD0C3", "#FEF3BD", "#C1E1C5", "#BEDADC", "#C4DEF6", "#BED3F3", "#D4C4FB"];

  return (
    <PickerParent className="pickers-parent">
      <ColorPickerWrapper>
        <HexInput
          type="text"
          value={strokeColor}
          onChange={(e) => {
            setStrokeColor(e.target.value);
          }}
        />

        <Swatch onClick={handleClick}>
          <Test color={strokeColor} />
        </Swatch>
      </ColorPickerWrapper>
      {displayColorPicker ? (
        <Popover>
          <Cover onClick={handleClose} />
          <Color triangle="top-right" colors={colorArray} color={strokeColor} onChange={handleChange} />
        </Popover>
      ) : null}
    </PickerParent>
  );
};

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 320px;
`;

const HexInput = styled.input`
  width: 100%;
  /*元々の<select>のスタイルを削除 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0 10px;
  /*今回指定する<select>のスタイル */
  /* height: 2.5em; */
  border: none;
  border-radius: 0.4rem;
  padding: 0.4rem 1.2rem 0.4rem 0.6rem;
  margin-right: 0.6rem;
  background-color: #e9f6f6;
  &:hover {
    cursor: pointer;
  }
`;

const Swatch = styled.div`
  padding: 5px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;

const PickerParent = styled.div`
  position: relative;
  /* overflow: hidden; */
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
  top: 50px;
  left: 44px;
  transition: all 0.5s;
`;

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const BMItemWrapper = styled.div``;

export default BMEditColor;
