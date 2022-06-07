import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSockets } from "../context/socket.context";
import workletURL from "./recorderWorkletProcessor.js?url";
import StartButton from "../molecules/start-button";
import StopButton from "../molecules/stop-button";

let volumeLog = [];
const Recording = () => {
  const [file, setFile] = useState([]);
  const [audioState, setAudioState] = useState(true);
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  const audioRef = useRef();
  const [isRecording, setRecordingStatus] = useState(false);
  const [globalStream, setGlobalStream] = useState(null);
  const [input, setInput] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [soundVolume, setVolume] = useState(0);
  const [lastTalkingTime, setLastTalkingTime] = useState(new Date());
  const [isSilence, setIsSilence] = useState(false);
  const [volumeAverage, setVolumeAverage] = useState(0);

  const refVolume = useRef(soundVolume);
  const refVolumeAverage = useRef(volumeAverage);
  const refIsSilence = useRef(isSilence);

  useEffect(() => {
    refVolume.current = soundVolume;
    refVolumeAverage.current = volumeAverage;
    refIsSilence.current = isSilence;
  }, [soundVolume, volumeAverage, isSilence]);

  useEffect(() => {
    setInterval(() => {
      // 定期実行する関数
      logVolume(refVolume.current);
    }, 33);
  }, []);

  const logVolume = (currentVolume) => {
    if (volumeLog.length < 60) volumeLog.push(soundVolume);
    else {
      volumeLog.shift();
      volumeLog.push(currentVolume);
    }
    const tailVolumes = volumeLog.slice(-5);

    const sum = volumeLog.reduce((a, b) => a + b, 0);
    const tailVolumeSum = tailVolumes.reduce((a, b) => a + b, 0);

    const volumeAverage = Math.floor(sum / volumeLog.length);
    const tailVolumeAverage = Math.floor(tailVolumeSum / tailVolumes.length);

    setVolumeAverage(volumeAverage);
    if (refVolumeAverage.current > 10 || tailVolumeAverage > 10) {
      if (refIsSilence.current) {
        console.log("resume it");
        setIsSilence(() => false);
        refIsSilence.current = false;
        resumeApiRequest();
      }
    } else {
      if (!refIsSilence.current) {
        console.log("pause it");
        setIsSilence(() => true);
        refIsSilence.current = true;
        pauseApiRequest();
      }
    }
    // console.log(volumeAverage);
  };

  const initRecording = async () => {
    socket.emit("activeStartStream");
    socket.emit("startGoogleCloudStream", ""); //init socket Google Speech Connection
    setRecordingStatus(true);
    // レコーディングのインスタンスを作成
    audioRef.current = new AudioContext({ latencyHint: "interactive" });
    await audioRef.current.audioWorklet.addModule(workletURL);
    audioRef.current.resume();
    const tmpGlobalStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const tmpInput = audioRef.current.createMediaStreamSource(tmpGlobalStream);
    setGlobalStream(tmpGlobalStream);
    const tmpProcessor = new window.AudioWorkletNode(audioRef.current, "recorder.worklet");
    tmpProcessor.connect(audioRef.current.destination);
    audioRef.current.resume();
    tmpInput.connect(tmpProcessor);
    setInput(tmpInput);

    tmpProcessor.port.onmessage = (e) => {
      const audioData = e.data;
      calcVolume(audioData);
      microphoneProcess(audioData);
    };
    setProcessor(tmpProcessor);

    const microphoneProcess = (buffer) => {
      socket.emit("binaryData", buffer);
    };
  };

  const calcVolume = (buffer) => {
    // console.log(buffer);
    let view = new Uint8Array(buffer);
    const length = view.byteLength;
    // console.log(view);
    let sum = 0;
    view.forEach((value) => {
      sum += value <= 122 ? value : 255 - value;
    });
    const volumeAmount = Math.floor(sum / length);
    setVolume(volumeAmount);
    // setVolume([...soundVolumeArray, volumeAmount]);
  };

  const handleStart = () => {
    initRecording();
  };

  // 録音停止
  const handleStop = () => {
    socket.emit("activeStopStream");
    socket.emit("endGoogleCloudStream", "");
    setMessages([tmpText, ...messages]);
    setTmpText(`▼ `);
    audioDisconnect();
    setRecordingStatus(false);
  };

  const pauseApiRequest = () => {
    socket.emit("pauseStream");
  };
  const resumeApiRequest = () => {
    socket.emit("resumeStream");
  };

  const audioDisconnect = () => {
    console.log("disconnect audio");
    let track = globalStream.getTracks()[0];
    track.stop();

    input.disconnect(processor);
    processor.disconnect(audioRef.current.destination);
    audioRef.current.close().then(function () {
      setInput(null);
      setProcessor(null);
      audioRef.current = null;
    });
  };

  socket.on("refreshSpeech", () => {
    setMessages([tmpText, ...messages]);
    setTmpText(`▼ `);
  });

  return (
    <div>
      <p>{isSilence ? "🙊" : "○"}</p>
      <p>{soundVolume}</p>
      <StartButton handleClick={handleStart} isRecording={isRecording} />
      <StopButton handleClick={handleStop} isRecording={isRecording} />
    </div>
  );
};

export default Recording;
