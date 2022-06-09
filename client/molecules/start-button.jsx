import React, { Fragment, useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";

const StartButton = ({ handleClick, isRecording }) => {
  const { socket } = useSockets();

  return (
    <Fragment>
      <button onClick={handleClick} disabled={isRecording}>
        Start
      </button>
    </Fragment>
  );
};

export default StartButton;
