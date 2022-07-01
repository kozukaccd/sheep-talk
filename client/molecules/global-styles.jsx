import { createGlobalStyle } from "styled-components";
import color from "../constant/color";

const GlobalStyles = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }

  ::-webkit-scrollbar-corner {
    height: 0;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 25px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${color.main};
    border-radius: 25px;
  }
  `;

export default GlobalStyles;
