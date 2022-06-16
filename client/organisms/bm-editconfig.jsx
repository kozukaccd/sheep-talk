import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../resource/color.js";
import { StyledBurger } from "../molecules/styled-burger";
import { slide as Menu } from "react-burger-menu";
import BMItemIcon from "../molecules/bm-item-icon";
import FontSVG from "../atoms/font-solid.svg?component";
import { useSockets } from "../context/socket.context";
import { SketchPicker } from "react-color";
import { useBubbleConfig } from "../context/bubble-config-context";

const BMEditConfig = () => {
  return (
    <BMItemWrapper>
      <BMItemIcon svg={<FontSVG />} dataTip="フキダシの色を変更できます" />
      <BMSelector />
    </BMItemWrapper>
  );
};

const BMSelector = () => {
  const [localFonts, setLocalFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("");
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  const [color, setColor] = useState({ r: "241", g: "112", b: "19", a: "1" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const { bubbleShapeList, setBubbleShapeList, bubbleConfig, setBubbleConfig } = useBubbleConfig();
  //bubbleConfig { shapeId: 1, strokeColor: color.main, x: 0, y: 0, width: "310px", height: "240px", fontSize: "22px" }

  useEffect(() => {
    socket.emit("getFontList");
    socket.on("getFontlist", (fonts) => {
      setLocalFonts(fonts);
      console.log("set default font");
      socket.emit("select-font", fonts[0]);
    });
  }, []);

  useEffect(() => {
    console.log(selectedFont);
    socket.emit("select-font", selectedFont);
  }, [selectedFont]);
  const handleSelectedFontChange = (e) => setSelectedFont(e.target.value);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (input) => {
    setColor(input.rgb);
  };

  return (
    <BMItemWrapper>
      <Swatch onClick={handleClick}>
        <Test color={color} />
      </Swatch>
      {displayColorPicker ? (
        <Popover>
          <Cover onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </Popover>
      ) : null}
      {/* <BMSelectorInput name="font-selector" onChange={(e) => handleSelectedFontChange(e)}>
      </BMSelectorInput> */}
    </BMItemWrapper>
  );
};

const Swatch = styled.div`
  padding: 5px;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`;

const Test = styled.div`
  width: 36px;
  height: 14px;
  border-radius: 2px;
  background: ${(props) => {
    `rgba(${props.color.r}, ${props.color.g}, ${props.color.b}, ${props.color.a})`;
  }};
`;
const Popover = styled.div`
  position: "absolute";
  z-index: "2";
`;
const Cover = styled.div`
  position: "fixed";
  top: "0px";
  right: "0px";
  bottom: "0px";
  left: "0px";
`;
// const BMSelectorInput = styled.div`
//   width: 100%;
//   /*元々の<select>のスタイルを削除 */
//   -webkit-appearance: none;
//   -moz-appearance: none;
//   appearance: none;

//   /*今回指定する<select>のスタイル */
//   /* height: 2.5em; */
//   border: none;
//   border-radius: 0.4rem;
//   padding: 0.4rem 1.2rem 0.4rem 0.6rem;
//   background-color: #e9f6f6;
//   &:hover {
//     cursor: pointer;
//   }
// `;
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
const BMItemWrapper = styled.div``;

export default BMEditConfig;
