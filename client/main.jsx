import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import SocketsProvider from "./context/socket.context";
import AudioDeviceProvider from "./context/audio-device-context";
import BubbleConfigProvider from "./context/bubble-config-context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketsProvider>
    <AudioDeviceProvider>
      <BubbleConfigProvider>
        {/* <React.StrictMode> */}
        <App />
        {/* </React.StrictMode> */}
      </BubbleConfigProvider>
    </AudioDeviceProvider>
  </SocketsProvider>
);
