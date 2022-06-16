import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import Recording from "../molecules/recording";
import FontSelector from "../molecules/font-selector";
import styled, { createGlobalStyle } from "styled-components";
import color from "../resource/color.js";
import BurgerMenu from "../organisms/burger-menu";

const SheepController = () => {
  return (
    <ControllerWrapper>
      <BurgerMenu pageWrapId={"page-wrap"} />
      {/* <Link to="/player" id="page-wrap">
        Playerを開く
      </Link> */}
      <Recording id="page-wrap" />
      {/* <FontSelector id="page-wrap" /> */}
    </ControllerWrapper>
  );
};

const ControllerWrapper = styled.div`
  background-color: ${color.main};
  width: 100%;
  height: 100vh;
`;

export default SheepController;
