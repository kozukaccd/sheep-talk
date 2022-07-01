import SheepPlayer from "./st-player/sheep-player";
import SheepController from "./st-controller/sheep-controller";
import { Routes, Route, HashRouter } from "react-router-dom";

import react, { useState, useEffect } from "react";
import { useSockets } from "./context/socket.context";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "LocalFont";
    src: url("/fonts/${(props) => props.selectedFont}" )
  }
  #balloon-text {
    font-family: "LocalFont";
  }
`;

function App() {
  const { socket } = useSockets();
  const [selectedFont, setSelectedFont] = useState("");

  // デフォルトフォントを定義
  useEffect(() => {
    socket.emit("getFontList");
    socket.on("getFontList", (fonts) => {
      socket.emit("select-font", fonts[0]);
    });
    socket.on("select-font", (data) => {
      setSelectedFont(data);
    });
  }, []);

  return (
    <div className="App">
      <GlobalStyle selectedFont={selectedFont} />
      <main>
        <HashRouter basename="/">
          <Routes>
            <Route path="/player" element={<SheepPlayer />} />
            <Route path="/" exact element={<SheepController />} />
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
}

export default App;
