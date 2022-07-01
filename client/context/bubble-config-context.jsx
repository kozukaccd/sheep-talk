import { useContext, createContext, useState, useEffect, useRef } from "react";
import color from "../constant/color";
import { useSockets } from "./socket.context";

const BubbleConfigContext = createContext({
  bubbleConfig: {},
  bubbleShapeList: [],
  currentBubbleShape: [],
  setInputDevice: () => false,
  setAudioDeviceList: () => false,
  setCurrentBubbleShape: () => false,
});

const BubbleConfigProvider = (props) => {
  const [bubbleShapeList, setBubbleShapeList] = useState(null);
  const [currentSelectedShapeId, setCurrentSelectedShapeId] = useState(0);
  const [config, setConfig] = useState(null);
  const { socket, messages, tmpText } = useSockets();
  const [configRaw, setConfigRaw] = useState(null);
  const [socketFlag, setSocketFlag] = useState(false);
  const configRawRef = useRef(null);
  useEffect(() => {
    socket.emit("getSvgList");
    socket.on("getSvgList", (svgs) => {
      setBubbleShapeList(svgs);
    });

    socket.emit("getUserConfig");
    socket.on("getUserConfig", (userConfig) => {
      // console.log("useConfig loaded");
      // console.log(userConfig);
      setConfigRaw(userConfig);
      console.log("aaaa", userConfig);
      setCurrentSelectedShapeId(userConfig.selectedShapeId);
    });

    socket.on("selectBubble", (id) => {
      // console.log(`currentSelectedShapeId is changed to${id} ===================================================================================`);
      setCurrentSelectedShapeId(id);
    });
    // console.log("useEffect直下");

    socket.on("bubbleConfigUpdate", (newConfig) => {
      if (configRawRef.current) {
        // console.log("とどいてるよ");
        // console.log("currentColor: ", configRawRef.current.shapeData[0].config.bubble.strokeColor);
        const tmp = { ...configRawRef.current };
        tmp.shapeData[newConfig.id] = newConfig;
        // console.log("targetColor: ", tmp.shapeData[0].config.bubble.strokeColor);
        setConfigRaw(tmp);
      }
    });
  }, []);

  useEffect(() => {
    // console.log("confgRawを変更");
    if (configRaw) {
      // console.log("来週のconfigは");
      // console.log(configRaw.shapeData[currentSelectedShapeId]);
      setConfig(configRaw.shapeData[currentSelectedShapeId]);
      configRawRef.current = configRaw;
    }
  }, [configRaw]);

  useEffect(() => {
    if (configRaw) {
      // console.log(configRaw.shapeData[currentSelectedShapeId]);
      setConfig(configRaw.shapeData[currentSelectedShapeId]);
    }
  }, [currentSelectedShapeId]);

  useEffect(() => {}, [config]);

  const saveCurrentUserConfig = () => {
    socket.emit("saveUserConfig", configRaw);
  };

  const saveUserConfig = (previousShapeId, targetShapeId) => {
    const newConfig = configRaw;
    newConfig.shapeData[previousShapeId] = config;
    newConfig.selectedShapeId = targetShapeId;
    socket.emit("saveUserConfig", newConfig);
  };

  return <BubbleConfigContext.Provider value={{ bubbleShapeList, setBubbleShapeList, config, setConfig, currentSelectedShapeId, saveCurrentUserConfig, saveUserConfig, configRaw }} {...props} />;
};

export const useBubbleConfig = () => useContext(BubbleConfigContext);
export default BubbleConfigProvider;
