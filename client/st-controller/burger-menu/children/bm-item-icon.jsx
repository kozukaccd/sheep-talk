import React, { Fragment, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../../../constant/color.js";
import { StyledBurger } from "./children/styled-burger";
import { slide as Menu } from "react-burger-menu";
import ReactTooltip from "react-tooltip";

const BMItemIcon = ({ svg, dataTip }) => {
  return (
    <Fragment>
      <SvgWrapper className="bm-svg-icon" data-tip={dataTip}>
        {svg}
      </SvgWrapper>
      <ReactTooltip />
    </Fragment>
  );
};

const SvgWrapper = styled.div`
  width: 2rem;
  margin-bottom: 1rem;
  svg {
    fill: #e9f6f6;
  }
`;

export default BMItemIcon;
