import React, { Fragment, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../resource/color.js";
import { StyledBurger } from "../molecules/styled-burger";
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
  width: 1.5rem;
  margin-bottom: 0.3rem;
  svg {
    fill: #e9f6f6;
  }
`;

export default BMItemIcon;
