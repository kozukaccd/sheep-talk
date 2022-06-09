import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import SocketsProvider from "./context/socket.context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketsProvider>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </SocketsProvider>
);
