import React, { Fragment, useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";
const StopButton = ({ handleClick, isRecording }) => {
  return (
    <Fragment>
      <button onClick={handleClick} disabled={!isRecording}>
        Stop
      </button>
    </Fragment>
  );
};

export default StopButton;
