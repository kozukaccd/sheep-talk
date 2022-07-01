import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { slide as Menu } from "react-burger-menu";
import BMSelectFont from "./children/bm-selectfont.jsx";
import BMSelectMic from "./children/bm-selectmic.jsx";
import BMEditConfig from "./children/bm-editconfig.jsx";
import BMEditColor from "./children/bm-bubble-stroke-color-editor.jsx";
import BMBubbleParamEditor from "./children/bm-bubble-param-editor.jsx";
import BMTextareaParamEditor from "./children/bm-textarea-param-editor.jsx";

const BurgerMenu = ({ pageWrapId }) => {
  return (
    <BurgerWrapper>
      <Menu width={"50vw"} styles={styles} right itemListElement="div" pageWrapId={pageWrapId} itemListClassName={"bmItemList"}>
        <BurgerMenuContentsWrapper className="bmItemList ">
          <BurgerMenuContent className="bmItem">
            <BMSelectMic />
          </BurgerMenuContent>

          <BBorder />

          <BurgerMenuContent className="bmItem">
            <BMEditConfig />
          </BurgerMenuContent>

          <BurgerMenuContent className="bmItem">
            <BMEditColor />
          </BurgerMenuContent>

          <BurgerMenuContent className="bmItem">
            <BMBubbleParamEditor />
          </BurgerMenuContent>
          <BBorder />

          <BurgerMenuContent className="bmItem">
            <BMSelectFont />
          </BurgerMenuContent>
          <BurgerMenuContent className="bmItem">
            <BMTextareaParamEditor />
          </BurgerMenuContent>
        </BurgerMenuContentsWrapper>
      </Menu>
    </BurgerWrapper>
  );
};

const BurgerWrapper = styled.div`
  z-index: 999;
`;
const BurgerMenuContentsWrapper = styled.div``;
const BurgerMenuContent = styled.div`
  padding: 1rem 0;
`;

const BBorder = styled.div`
  margin: 0;
  border-bottom: 3px solid #5c6775;
  margin: 1rem 0 0.5rem 0;
`;

const Border = styled.div`
  margin: 0.5rem 10px;
  border-bottom: 2px solid #232527;
`;

const styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    right: "36px",
    top: "36px",
  },
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "50px",
    width: "50px",
    right: "16px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    // position: "fixed",
    // height: "100vh",
  },
  bmMenu: {
    background: "#373a47",
    padding: "2.5em 1.5em  1.5em",
    fontSize: "1.15em",
    overflow: "auto",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    // color: "#b8b7ad",
  },
  bmItem: {
    // display: "inline-block",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
  },
};

export default BurgerMenu;
