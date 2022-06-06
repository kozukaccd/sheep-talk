import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSockets } from "../context/socket.context";
import workletURL from "./recorderWorkletProcessor.js?url";
import StartButton from "../molecules/start-button";
import StopButton from "../molecules/stop-button";

const Recording = () => {
  const [file, setFile] = useState([]);
  const [audioState, setAudioState] = useState(true);
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  const audioRef = useRef();
  const [isRecording, setRecordingStatus] = useState(false);
  const [globalStream, setGlobalStream] = useState(null);
  const [input, setInput] = useState(null);
  const [processor, setProcessor] = useState(null);

  useEffect(() => {}, []);

  const initRecording = async () => {
    console.log("create instance of recording");
    socket.emit("startGoogleCloudStream", ""); //init socket Google Speech Connection
    setRecordingStatus(true);
    // レコーディングのインスタンスを作成
    audioRef.current = new AudioContext({ latencyHint: "interactive" });
    console.log("here");
    await audioRef.current.audioWorklet.addModule(workletURL);
    console.log("here2");
    audioRef.current.resume();
    const tmpGlobalStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const tmpInput = audioRef.current.createMediaStreamSource(tmpGlobalStream);
    setGlobalStream(tmpGlobalStream);
    const tmpProcessor = new window.AudioWorkletNode(audioRef.current, "recorder.worklet");
    tmpProcessor.connect(audioRef.current.destination);
    console.log(tmpProcessor);
    audioRef.current.resume();
    tmpInput.connect(tmpProcessor);
    setInput(tmpInput);
    tmpProcessor.port.onmessage = (e) => {
      const audioData = e.data;
      microphoneProcess(audioData);
    };
    setProcessor(tmpProcessor);
    const microphoneProcess = (buffer) => {
      socket.emit("binaryData", buffer);
    };
  };

  const handleStart = () => {
    // startButton.disabled = true;
    // endButton.disabled = false;
    // recordingStatus.style.visibility = "visible";
    console.log("やるぞやるぞ");
    initRecording();
  };

  // 録音停止
  const handleStop = () => {
    socket.emit("endGoogleCloudStream", "");
    setMessages([tmpText, ...messages]);
    setTmpText(`▼ `);
    let track = globalStream.getTracks()[0];
    track.stop();

    input.disconnect(processor);
    processor.disconnect(audioRef.current.destination);
    audioRef.current.close().then(function () {
      // input = null;
      // processor = null;
      // context = null;
      setInput(null);
      setProcessor(null);
      audioRef.current = null;

      // AudioContext = null;
      // startButton.disabled = false;
    });
    setRecordingStatus(false);
  };

  const handleRemove = () => {
    setAudioState(true);
    setFile([]);
  };

  const hancleError = () => {
    alert("エラーです。");
  };

  socket.on("speechData", (data) => {
    var dataFinal = undefined || data.results[0].isFinal;

    if (dataFinal === false) {
      setTmpText(`▼ ${data.results[0].alternatives[0].transcript}`);
    }
  });

  socket.on("refreshSpeech", () => {
    setMessages([tmpText, ...messages]);
    setTmpText(`▼ `);
  });

  return (
    <div>
      <StartButton handleClick={handleStart} isRecording={isRecording} />
      <StopButton handleClick={handleStop} isRecording={isRecording} />
    </div>
  );
};

export default Recording;
