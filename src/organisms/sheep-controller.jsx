import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Recording from "../molecules/recording";
import { useSockets } from "../context/socket.context";
import MessageField from "../molecules/message-field";

const SheepController = () => {
  return (
    <div>
      <Recording />
    </div>
  );
};

export default SheepController;
