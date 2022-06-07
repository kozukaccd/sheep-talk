import { useState } from "react";
import Sheep from "./organisms/sheep";
import SheepController from "./organisms/sheep-controller";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header></header>

      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Sheep />}></Route>
            <Route path="/controller" element={<SheepController />}></Route>
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
