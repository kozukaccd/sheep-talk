import React, { useState, useEffect, useRef, Fragment } from "react";
import styled from "styled-components";
import color from "../../../constant/color.js";
import { StyledBurger } from "./children/styled-burger";
import { slide as Menu } from "react-burger-menu";
import BMItemIcon from "./bm-item-icon";
import FontSVG from "../../../atoms/font-solid.svg?component";
import { useSockets } from "../../../context/socket.context";

const BMSelectFont = () => {
  return (
    <BMItemWrapper>
      <BMItemIcon svg={<FontSVG />} dataTip="フキダシに使用するフォントが変更できます" />
      <BMSelector />
    </BMItemWrapper>
  );
};

const BMSelector = () => {
  const [localFonts, setLocalFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("");
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  useEffect(() => {
    socket.emit("getFontList");
    socket.on("getFontList", (fonts) => {
      setLocalFonts(fonts);
    });
  }, []);
  useEffect(() => {
    // console.log(selectedFont);
    socket.emit("select-font", selectedFont);
  }, [selectedFont]);
  const handleSelectedFontChange = (e) => setSelectedFont(e.target.value);

  return (
    <BMSelectorInputWrapper className="bm-selector-input-wrapper">
      <BMSelectorInput name="font-selector" onChange={(e) => handleSelectedFontChange(e)}>
        {localFonts.map((item, i) => {
          return (
            <option key={`key-${item}`} value={item}>
              {item}
            </option>
          );
        })}
      </BMSelectorInput>
    </BMSelectorInputWrapper>
  );
};

const BMSelectorInput = styled.select`
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
  background-color: #e9f6f6;
  &:hover {
    cursor: pointer;
  }
`;
const BMSelectorInputWrapper = styled.div`
  position: relative;
  margin: 0em 0em 0em 0em;
  float: left;
  height: 2rem;
  width: 315px;
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

export default BMSelectFont;
