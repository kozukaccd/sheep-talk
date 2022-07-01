import React, { Fragment, useState, useEffect, useRef } from "react";
import mojs from "@mojs/core";
import styled from "styled-components";
import color from "../constant/color.js";
import { useAudioDevice } from "../context/audio-device-context";

const DEFAULT_CIRCLE_RADIUS = 100;
const DEFAULT_BUTTON_COLOR = "226,88,56";
const MIC_SVG = `<path d="M34.37,68.75A18.74,18.74,0,0,0,53.12,50V18.75a18.75,18.75,0,0,0-37.5,0V50A18.65,18.65,0,0,0,34.37,68.75ZM64.06,37.5A4.64,4.64,0,0,0,59.37,42v8A25,25,0,0,1,32.75,74.94C19.85,74.13,9.37,61.94,9.37,49V42A4.64,4.64,0,0,0,4.69,37.5,4.65,4.65,0,0,0,0,42v6.28C0,65.8,12.49,81.42,29.69,83.78v6.84H21.87a6.25,6.25,0,0,0-6.24,6.56A3.08,3.08,0,0,0,18.75,100H50a3.07,3.07,0,0,0,3.12-2.82,6.26,6.26,0,0,0-6.25-6.56H39.06V84A34.41,34.41,0,0,0,68.75,50V42A4.64,4.64,0,0,0,64.06,37.5Z"/>`;

class Mic extends mojs.CustomShape {
  getShape() {
    return `${MIC_SVG}`;
  }
  getLength() {
    return 200;
  } // optional
}

const RecToggleButton = ({ soundVolume, handleClick }) => {
  const volumeWaveRef = useRef();
  const isAnimPlaying = useRef(false);
  const volumeMemory = useRef(DEFAULT_CIRCLE_RADIUS);
  const volumeButtonRef = useRef();
  const micIconRef = useRef();
  const volumeButtonBurstRef = useRef();
  const volumeButtonWaveRef = useRef();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const isMouseOverRef = useRef(false);
  const [isRec, setRec] = useState("default");
  const coefRef = useRef([1, 1]);
  const noiseAnimationRef = useRef();
  const { inputDevice, setInputDevice, audioDeviceList, setAudioDeviceList } = useAudioDevice();

  mojs.addShape("Mic", Mic);

  useEffect(() => {
    if (!isRec && isRec !== "default") {
      setRec(!isRec);
    }
  }, [inputDevice]);

  useEffect(() => {
    const volumeWave = new mojs.Shape({
      parent: "#volume-wave",
      shape: "circle",
      fill: `rgba(${DEFAULT_BUTTON_COLOR},1)`,
      strokeWidth: 4,
      stroke: "rgba(0,0,0,0)",
      radius: 10,
      //   isYoyo: true,
      easing: "sin.out",
      isShowStart: true,
      duration: 3000,
      repeat: 0,
      onStart: () => {
        // console.log("==========================================> start");
        isAnimPlaying.current = true;
      },
      onComplete: () => {
        // console.log("==========================================> finished");
        isAnimPlaying.current = false;
      },
      onProgress: () => {
        // console.log("on duty ");
      },
    });

    volumeButtonRef.current = new mojs.Shape({
      parent: "#mic-button",
      shape: "circle",
      fill: `#438181`,
      radius: DEFAULT_CIRCLE_RADIUS,
      scale: 1,
      left: "50%",
      top: "50%",
      repeat: 1,
    }).play();

    micIconRef.current = new mojs.Shape({
      parent: "#mic",
      shape: "Mic",
      fill: `${color.main}`,
      radius: { [DEFAULT_CIRCLE_RADIUS]: [DEFAULT_CIRCLE_RADIUS + 5] },
      duration: 300,
      scale: 0.5,
      left: "50%",
      top: "50%",
      x: 16,
      isYoyo: true,
      easing: "ease.out",
      repeat: 1,
    }).play();

    volumeButtonBurstRef.current = new mojs.Burst({
      parent: "#mic-button",
      left: "50%",
      top: "50%",
      radius: { 170: 220 },
      angle: 45,
      count: 9,
      children: {
        shape: "line",
        radius: 10,
        scale: 1,
        stroke: `rgba(${DEFAULT_BUTTON_COLOR},1)`,
        strokeLinecap: "round",
        strokeWidth: 10,
        strokeDasharray: "100%",
        strokeDashoffset: { "-100%": "100%" },
        duration: 500,
        easing: "quad.out",
      },
      onStart: () => {},
    });

    volumeButtonWaveRef.current = new mojs.Shape({
      parent: "#mic-button",
      left: "50%",
      top: "50%",
      fill: `rgba(0,0,0,0)`,
      stroke: { [`rgba(${DEFAULT_BUTTON_COLOR})`]: [`rgba(${DEFAULT_BUTTON_COLOR},0)`] },
      strokeWidth: { 30: 0 },
      radius: { [DEFAULT_CIRCLE_RADIUS]: [DEFAULT_CIRCLE_RADIUS + 100] },
      duration: 700,
      easing: "sin.out",
      isShowEnd: false,
    });

    // shakeを追加==========================================================
    const noise = mojs.easing.path(
      "M0,100 L1.98696332,100.629117 L3.53838746,97.8756628 L5.99628366,101.223339 L7.55950567,96.8122389 L10.1815894,101.223339 L14.0277054,95.8836259 L16.1247825,101.164595 L20.9432423,95.6155105 L24.669413,101.207523 L29.2253694,93.4487468 L32.6556094,103.200313 L37.2037006,92.4636488 L40.1757887,103.28617 L41.8363434,91.0417336 L45.2449539,105.027414 L46.5555042,89.4345477 L50.5097677,105.294776 L55.6674171,87.3001687 L59.2510299,106.960707 L62.5721393,85.5431093 L65.6317285,105.27896 L69.6410488,83.6015324 L73.3996638,104.869256 L76.8859438,81.1907535 L78.8080186,106.960707 L80.7310767,80.0527695 L83.9656681,104.876787 L85.8887261,78.1774683 L88.3358076,107.094764 L91.3944137,78.7807278 L95.0763423,103.521901 L97.5234238,79.5677518 L100,100"
    );

    noiseAnimationRef.current = new mojs.Tween({
      duration: 600,
      onUpdate: function onUpdate(ep, p, isFwd) {
        const nozieP = noise(p);
        const transform = `translate( ${coefRef.current[0] * (10 * nozieP)} px, ${coefRef.current[1] * (10 * nozieP)}px )`;

        setNoiseTransformCss(transform);
      },
      onComplete: () => {
        if (isMouseOverRef.current) {
          coefRef.current = [Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1];
          setTimeout(() => {
            noiseAnimationRef.current.play();
          }, 1);
        }
      },
    });
    // shakeTween.play();

    // shakeを追加==========================================================

    volumeWaveRef.current = volumeWave;
    volumeWaveRef.current.play();
  }, []);

  useEffect(() => {
    if (!isAnimPlaying.current) {
      const targetRadius = DEFAULT_CIRCLE_RADIUS + soundVolume * 2;

      volumeWaveRef.current
        .tune({
          fill: `rgba(${DEFAULT_BUTTON_COLOR},0)`,
          strokeWidth: { [`${20 + soundVolume / 3}`]: 0 },
          stroke: { [`rgba(${DEFAULT_BUTTON_COLOR},0)`]: `rgba(${DEFAULT_BUTTON_COLOR},1)` },
          radius: { [DEFAULT_CIRCLE_RADIUS + 10]: [targetRadius + 30] },
          duration: 2000,
          easing: "sin.out",
          isShowEnd: false,
          onStart: () => {
            isAnimPlaying.current = true;
          },
          onComplete: () => {
            isAnimPlaying.current = false;
          },
        })
        .replay();
      micIconRef.current.replay();
      volumeMemory.current = targetRadius;
    }
  }, [soundVolume]);

  // ボタンクリック時のイベント
  useEffect(() => {
    // console.log("test");
    if (isRec === false) {
      // volumeButtonBurstRef.current.replay();
      volumeButtonWaveRef.current.replay();
      volumeButtonRef.current
        .tune({
          fill: `rgba(${DEFAULT_BUTTON_COLOR},1)`,
          stroke: { [`rgba(250, 230, 80,1)`]: [`rgba(255, 251, 219,1)`] },
          strokeLinecap: "round",
          strokeWidth: { 20: 0 },
          strokeOpacity: 1,
          strokeDasharray: "100%",
          strokeDashoffset: { "-100%": "100%" },
          easing: "cubic.out",
          duration: 3000,
          repeat: 10000,
        })
        .replay();
    } else if (isRec === true) {
      volumeButtonBurstRef.current.replay();
      volumeButtonWaveRef.current.replay();
      volumeButtonRef.current
        .tune({
          fill: `#438181`,
          stroke: `rgba(250, 230, 80,1)`,
          strokeWidth: 0,
          strokeOpacity: 0,
          duration: 3000,
          strokeDashoffset: "100%",
        })
        .replay();
    } else {
      // console.log("nope");
    }
  }, [isRec]);

  useEffect(() => {
    // console.log("mouse o-ba- status is ", isMouseOver);
    // noiseAnimationRef.current.play();
  }, [isMouseOver]);

  const mouseEnterHandler = () => {
    // isMouseOverRef.current = true;
    // setIsMouseOver(true);
  };

  const mouseLeaveHandler = () => {
    // isMouseOverRef.current = false;
    // setIsMouseOver(false);
  };

  // TODO: 音量値はsoundVolumeで管理している。メーターを作るときはこれを使う

  return (
    <VolumeAnimationWrapper id="volume-animation-wrapper">
      <VolumeAnimation
        onClick={() => {
          handleClick();
          setRec(!isRec);
        }}
        id="volume-animation"
      >
        <div id="volume-wave"></div>
        <div className="button-wrapper" onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
          <div id="mic-button" className="mic-button"></div>
          <div id="mic"></div>
        </div>
      </VolumeAnimation>
      {/* <p>{200 + soundVolume}</p> */}
    </VolumeAnimationWrapper>
  );
};

// const ButtonWrapper = styled.div`
//   transform: ${({ noiseTransformCss }) => {
//     return noiseTransformCss;
//   }};
// `;

const VolumeAnimationWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const VolumeAnimation = styled.div`
  position: relative;
  left: 38%;
  top: 48%;
  width: 200px;
  height: 200px;
  /* background-color: red; */
  transition-duration: 0.6s;
  .button-wrapper {
    width: 100%;
    height: 100%;
    transition-duration: 0.6s;

    &:hover {
      cursor: pointer;
      transform: scale(1.04);
      transition-duration: 0.6s;
    }
  }
`;

export default RecToggleButton;
