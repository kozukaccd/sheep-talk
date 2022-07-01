import React, { Fragment, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useBubbleConfig } from "../../../context/bubble-config-context";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useSockets } from "../../../context/socket.context";

const BMBubbleParamEditor = () => {
  const { bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveUserConfig } = useBubbleConfig();
  const scaleRatio = config ? config.config.bubble.scale / 3 : 1;
  return (
    <BMItemWrapper>
      {/* <BMItemIcon svg={<WrenchSVG />} dataTip="フキダシの色を変更できます" /> */}
      {config ? (
        <Fragment>
          <SliderItemWrapper>
            <SliderItem text={"x位置"} min={0} max={2300 * scaleRatio} step={0.1} propName={"x"} type={"bubble"} />
            <SliderItem text={"Y位置"} min={0} max={1500 * scaleRatio} step={0.1} propName={"y"} type={"bubble"} />
            <SliderItem text={"大きさ"} min={0} max={5} step={0.1} propName={"scale"} type={"bubble"} />
            <SliderItem text={"フチ太さ"} min={0} max={4} step={0.1} propName={"strokeWidth"} type={"bubble"} />
            <SliderItem text={"回転"} min={0} max={360} step={1} propName={"rotate"} type={"bubble"} />
          </SliderItemWrapper>
        </Fragment>
      ) : null}
    </BMItemWrapper>
  );
};

const SliderItemWrapper = styled.div``;

const SliderItem = ({ text, min, max, step, propName, type }) => {
  const { bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveUserConfig, saveCurrentUserConfig } = useBubbleConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const { socket, messages, tmpText } = useSockets();

  useEffect(() => {
    // console.log("localConfigを設定");
    setLocalConfig(config);
    // console.log(config.config["textArea"]);
  }, [config]);

  useEffect(() => {
    // console.log("localconfig updated");
    // console.log(localConfig);
  }, [localConfig]);

  const updateConfig = (propName, type, value) => {
    const tmp = { ...localConfig };
    tmp.config[type][propName] = value;
    socket.emit("bubbleConfigUpdate", tmp);
  };

  return (
    <SliderWrapper className={`bubble-${propName}`}>
      <SliderLabel text={text} />
      <Slider
        min={min}
        max={max}
        value={config.config[type][propName]}
        step={step}
        onChange={(e) => {
          updateConfig(propName, type, e);
        }}
        onBeforeChange={() => {
          if (type === "textArea") {
            socket.emit("toggleTextAreaEditMode", true);
          }
        }}
        onAfterChange={() => {
          saveCurrentUserConfig();
          if (type === "textArea") {
            socket.emit("toggleTextAreaEditMode", false);
          }
        }}
      />
    </SliderWrapper>
  );
};

const SliderLabelWrapper = styled.div`
  color: white;
  margin-right: 1rem;
  margin-left: 10px;
  font-size: 14px;
  > p {
    text-align: left;
    margin: 0 auto;
  }
  width: 35%;
`;
const SliderLabel = ({ text }) => {
  return (
    <SliderLabelWrapper>
      <p>{text}</p>
    </SliderLabelWrapper>
  );
};

const SliderWrapper = styled.div`
  padding: 0.2rem 1rem 0.2rem 0;
  display: flex;
  align-items: center;
`;
const BMItemWrapper = styled.div`
  overflow: auto;
`;

export default BMBubbleParamEditor;
