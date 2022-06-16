import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import color from "../resource/color.js";
import { StyledBurger } from "../molecules/styled-burger";
import { slide as Menu } from "react-burger-menu";
import BMItemIcon from "../molecules/bm-item-icon";
import MicSVG from "../atoms/microphone-solid.svg?component";
import { useAudioDevice } from "../context/audio-device-context";

const BMSelectMic = () => {
  return (
    <BMItemWrapper>
      <BMItemIcon svg={<MicSVG />} dataTip="入力用デバイスを変更できます" />
      <BMSelector />
    </BMItemWrapper>
  );
};

const BMSelector = () => {
  // const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  const { inputDevice, setInputDevice, audioDeviceList, setAudioDeviceList } = useAudioDevice();

  useEffect(() => {
    const getUserAudioDevices = async () => {
      console.log(audioDeviceList);
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const inputDevices = allDevices.filter((device) => device.kind === "audioinput");
      setAudioDeviceList(inputDevices);
    };
    getUserAudioDevices();
  }, []);

  const handleSelectedMicChange = (e) => setInputDevice(e.target.value);

  return (
    <BMSelectorInputWrapper>
      <BMSelectorInput name="mic-selector" onChange={(e) => handleSelectedMicChange(e)}>
        {audioDeviceList.map((item, i) => {
          return (
            <option key={`key-${i}`} value={item.deviceId}>
              {item.label}
            </option>
          );
        })}
      </BMSelectorInput>
    </BMSelectorInputWrapper>
  );
};

const BMSelectorInput = styled.select`
  width: 100%;
  /*元々の<select>のスタイルを削除 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /*今回指定する<select>のスタイル */
  /* height: 2.5em; */
  border: none;
  border-radius: 0.4rem;
  padding: 0.4rem 1.2rem 0.4rem 0.6rem;
  background-color: #e9f6f6;
  &:hover {
    cursor: pointer;
  }
`;
const BMSelectorInputWrapper = styled.div`
  position: relative;
  margin: 0em 0em 0em 0em;
  float: left;

  &::after {
    pointer-events: none; /*矢印部分をクリックを可能にする*/
    position: absolute;
    color: #2f3e4f;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%); /*▼を上に移動*/
    content: "▼";
  }
`;
const BMItemWrapper = styled.div``;

export default BMSelectMic;
