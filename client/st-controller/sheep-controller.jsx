import React, { useState, useEffect, useRef } from "react";
import Recording from "../molecules/recording";
import styled, { createGlobalStyle } from "styled-components";
import color from "../constant/color.js";
import BurgerMenu from "./burger-menu";

const SheepController = () => {
  return (
    <ControllerWrapper>
      <BurgerMenu pageWrapId={"page-wrap"} />
      <Recording id="page-wrap" />
    </ControllerWrapper>
  );
};

const ControllerWrapper = styled.div`
  background-color: ${color.main};
  width: 100%;
  height: 100vh;
`;

export default SheepController;
