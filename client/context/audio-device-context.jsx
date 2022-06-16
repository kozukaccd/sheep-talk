import { useContext, createContext, useState, useEffect } from "react";

const AudioDeviceContext = createContext({
  inputDevice: "default",
  audioDeviceList: [],
  setInputDevice: () => false,
  setAudioDeviceList: () => false,
});

const AudioDeviceProvider = (props) => {
  const [inputDevice, setInputDevice] = useState("default");
  const [audioDeviceList, setAudioDeviceList] = useState([]);

  return <AudioDeviceContext.Provider value={{ inputDevice, setInputDevice, audioDeviceList, setAudioDeviceList }} {...props} />;
};

export const useAudioDevice = () => useContext(AudioDeviceContext);
export default AudioDeviceProvider;

//\=========================================================================================
//\=========================================================================================
//\=========================================================================================
//\=========================================================================================

// import { useContext, createContext, useState, useEffect } from "react";

// //SOCKET_URLの中身のところに接続を要求
// const socket = io("http://localhost:5098/");

// const SocketContext = createContext({
//   socket,
//   setUsername: () => false,
//   setMessages: () => false,
// });

// const SocketsProvier = (props) => {
//   const [messages, setMessages] = useState([]);
//   const [tmpText, setTmpText] = useState(``);

//   return <SocketContext.Provider value={{ socket, messages, setMessages, tmpText, setTmpText }} {...props} />;
// };

// export const useSockets = () => useContext(SocketContext);

// // export default SocketsProvier;
