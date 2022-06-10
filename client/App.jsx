import Sheep from "./organisms/sheep";
import SheepController from "./organisms/sheep-controller";
import Test from "./organisms/test";
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

  console.log("===================");
  console.log(Sheep);
  console.log(SheepController);
  console;
  console.log("===================");
  useEffect(() => {
    socket.on("select-font", (data) => {
      console.log("koko is ugoiteru");
      setSelectedFont(data);
    });
  }, [selectedFont]);

  return (
    <div className="App">
      <GlobalStyle selectedFont={selectedFont} />
      <header>
        <p>aiueo</p>
      </header>
      <main>
        <HashRouter basename="/">
          <Routes>
            <Route path="/player" element={<Sheep />} />
            <Route path="/" exact element={<SheepController />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
}

const TestComponent = () => {
  return <p>testaaaa</p>;
};

export default App;
