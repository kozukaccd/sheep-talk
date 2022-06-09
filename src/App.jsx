import Sheep from "./organisms/sheep";
import SheepController from "./organisms/sheep-controller";
import Test from "./organisms/test";
import { Routes, Route, BrowserRouter } from "react-router-dom";

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

  useEffect(() => {
    socket.on("select-font", (data) => {
      console.log("koko is ugoiteru");
      setSelectedFont(data);
    });
  }, [selectedFont]);

  return (
    <div className="App">
      <GlobalStyle selectedFont={selectedFont} />
      <header></header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/player" element={<Sheep />}></Route>
            <Route path="/" element={<SheepController />}></Route>
            <Route path="/test" element={<Test />}></Route>
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
