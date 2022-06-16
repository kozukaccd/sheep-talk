import { useContext, createContext, useState, useEffect } from "react";
import color from "../resource/color";

const BubbleConfigContext = createContext({
  bubbleConfig: {},
  bubbleShapeList: [],
  setInputDevice: () => false,
  setAudioDeviceList: () => false,
});

const BubbleConfigProvider = (props) => {
  const [bubbleShapeList, setBubbleShapeList] = useState([]);
  const [bubbleConfig, setBubbleConfig] = useState({ shapeId: 1, strokeColor: color.main, x: 0, y: 0, width: "310px", height: "240px", fontSize: "22px" });

  return <BubbleConfigContext.Provider value={{ bubbleShapeList, setBubbleShapeList, bubbleConfig, setBubbleConfig }} {...props} />;
};

export const useBubbleConfig = () => useContext(BubbleConfigContext);
export default BubbleConfigProvider;
