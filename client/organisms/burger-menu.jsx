import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../resource/color.js";
import { StyledBurger } from "../molecules/styled-burger";
import { slide as Menu } from "react-burger-menu";
import BMSelectFont from "./bm-selectfont.jsx";
import BMSelectMic from "./bm-selectmic.jsx";
import BMEditConfig from "./bm-editconfig.jsx";

const BurgerMenu = ({ pageWrapId }) => {
  return (
    <BurgerWrapper>
      <Menu width={"35vw"} styles={styles} right itemListElement="div" pageWrapId={pageWrapId} itemListClassName={"bmItemList"}>
        <BurgerMenuContentsWrapper className="bmItemList aaatest">
          <BurgerMenuContent className="bmItem">
            <BMSelectFont />
          </BurgerMenuContent>

          <BurgerMenuContent className="bmItem">
            <BMSelectMic />
          </BurgerMenuContent>

          <BurgerMenuContent className="bmItem">
            <BMEditConfig />
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
  padding: 2rem 0;
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
    overflow: "hidden",
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
