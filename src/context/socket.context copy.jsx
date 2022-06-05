import { useContext, createContext, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
// import { SOCKET_URL } from "./config/default";
// import EVENTS from "./config/events";
const audioContext = useRef(null);

const AudioContext = createContext({
  audioContext,
});

const AudioProvier = (props) => {
  useEffect(() => {
    audioContext.current = new AudioContext();
  }, []);

  return <AudioContext.Provider value={{ audio }} {...props} />;
};

export const useAudio = () => useContext(AudioContext);

export default SocketsProvier;
