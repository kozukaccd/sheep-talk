import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import Recording from "../molecules/recording";
import FontSelector from "../molecules/font-selector";
import styled, { createGlobalStyle } from "styled-components";
import color from "../resource/color.js";

const SheepController = () => {
  return (
    <ControllerWrapper>
      <Link to="/player">Playerを開く</Link>
      <Recording />
      <FontSelector />
    </ControllerWrapper>
  );
};

const ControllerWrapper = styled.div`
  background-color: ${color.main};
  width: 100vw;
  height: 100vh;
`;

export default SheepController;
