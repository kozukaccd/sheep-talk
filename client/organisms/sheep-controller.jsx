import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import Recording from "../molecules/recording";
import FontSelector from "../molecules/font-selector";

const SheepController = () => {
  return (
    <div>
      <p>sheep controller</p>
      <Link to="/player">Playerを開く</Link>
      <Recording />
      <FontSelector />
    </div>
  );
};

export default SheepController;
