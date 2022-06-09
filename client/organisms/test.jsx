import React, { useState, useEffect, useRef } from "react";
import mojs from "@mojs/core";
import styled from "styled-components";
class SpeechBubble extends mojs.CustomShape {
  getShape() {
    return `<path class="cls-1" d="M12.92,65.49,1.09,27.61a6.92,6.92,0,0,1,2.29-7.5L25.72,2.29A6.93,6.93,0,0,1,30.61.79L77.05,4.54a7,7,0,0,1,6.39,7.16L81.87,56.2a6.92,6.92,0,0,1-6,6.64L55.58,65.52,46.34,79.07l-1.53-12L20.47,70.3A7,7,0,0,1,12.92,65.49Z"/>`;
  }
  getLength() {
    return 200;
  } // optional
}

const dummy =
  "親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小";

const Test = () => {
  const textContentRef = useRef();
  useEffect(() => {
    // do for each seconds
    // const interval = setInterval(() => {});
    textContentRef.current.scrollTop = textContentRef.current.scrollHeight;
  });
  useEffect(() => {
    const textMessage = new mojs.Html({
      el: "#text-message",
      //   isShowEnd: true,
      //   isForce3d: true,
      //   scale: { 0: 5, easing: "elastic.out" },
      //   rotateZ: { [-90]: 0, easing: "elastic.out" },
      //   duration: 1550,
      //   easing: "cubic.out",
      //   origin: "50% 100%",
      //   isForce3d: true,

      scale: { 0: 1, duration: 1550, easing: "elastic.out" },
      rotateZ: {
        [-90]: 0,
        duration: 1550,
        easing: "elastic.out",
      },
    });
    // const character1 = document.createElement("div");
    // character1.classList.add("character");
    // textMessage.el.appendChild(textContentRef.current);

    // character1.innerHTML = "test";
    textMessage.play();

    mojs.addShape("speechBubble", SpeechBubble); // passing name and Bubble class
    // now it is avaliable on mojs.Shape constructor as usual
    const speechBubble = new mojs.Shape({
      shape: "speechBubble",
      fill: "none",
      stroke: "#FFC107",
      //   radius: 45,
      scale: { 0: 5, easing: "elastic.out" },
      rotate: { [-90]: 0, easing: "elastic.out" },
      duration: 1550,
      easing: "cubic.out",
      origin: "50% 100%",
      isForce3d: true,
      parent: "#bouncyCircle",
      top: "690px",
      left: "920px",
    });
    speechBubble.play();
  }, []);
  return (
    <div style={{ scale: "200%" }}>
      <p>hello world</p>
      <TextMessage id="text-message">
        <p ref={textContentRef}>{dummy}</p>
      </TextMessage>
      <div id="bouncyCircle"></div>
    </div>
  );
};

const textAreaSizeX = "300px";
const textAreaSizeY = "240px";
const TextMessage = styled.div`
  /* background-color: #aaaaaa; */
  width: ${textAreaSizeX};
  height: ${textAreaSizeY};
  position: absolute;
  top: 300px;
  left: 750px;
  transform-origin: 50% 140%;
  p {
    font-size: 22px;
    position: absolute; /*自由に配置する指定*/
    bottom: 0; /*下寄せの指定*/
    right: 0;
    margin: 0;
    word-wrap: break-word;
    overflow-y: auto;
    width: ${textAreaSizeX};
    height: ${textAreaSizeY};
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
export default Test;
