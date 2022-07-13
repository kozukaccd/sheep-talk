const dotenv = require("dotenv");
dotenv.config();

const PORT = 5098;
const app = require("express")();
const http = require("http").createServer(app);

const path = require("path");
const fs = require("fs");
const LANG = "EN";
const translate = require("deepl");

import getSvgFiles from "./get-svg-files.js";
import getUserConfig, { saveUserConfig } from "./use-user-config.js";

const mode = process.env["MODE"];
const basePath = mode === "development" ? "./public" : "./resources/app/dist";

const log = [{ id: 1, jp: "以下ログファイル", translated: "translated" }];

const socketServer = () => {
  // Google Cloud
  const speech = require("@google-cloud/speech");
  const speechClient = new speech.SpeechClient();
  let timeStamp = 0;
  let isAnimationPlaying = false;

  const io = require("socket.io")(http, {
    cors: {
      methods: ["GET", "POST"],
      origin: "*",
    },
  });

  http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });

  io.on("connection", (client) => {
    console.log("new client connected. socket.id=" + client.id);
    let recognizeStream = null;

    client.on("join", () => {
      client.emit("messages", "Socket Connected to Server");
    });

    client.on("messages", (data) => {
      client.emit("broad", data);
    });

    client.on("startGoogleCloudStream", () => {
      const id = new Date().getTime().toString();
      startRecognitionStream(id);
    });

    client.on("endGoogleCloudStream", () => {
      stopRecognitionStream();
    });

    client.on("binaryData", (data) => {
      // console.log(data); //log binary data
      if (recognizeStream !== null) {
        recognizeStream.write(data);
      } else {
        // console.log("mic data is receiving but ignored");
      }
    });

    client.on("pauseStream", () => {
      if (recognizeStream !== null) {
        // console.log("pausing stream");
        stopRecognitionStream();
      }
    });
    client.on("resumeStream", () => {
      if (recognizeStream === null) {
        // console.log("restarting stream");
        const id = new Date().getTime().toString();
        startRecognitionStream(id);
      }
    });

    client.on("getFontList", () => {
      try {
        const fontsList = fs
          // .readdirSync("./public/fonts", { withFileTypes: true }) //同期でファイル読み込み
          .readdirSync(`${basePath}/fonts`, { withFileTypes: true }) //同期でファイル読み込み
          .filter((dirent) => dirent.isFile())
          .map(({ name }) => name) //フォルダ除外
          .filter(function (file) {
            return path.extname(file).toLowerCase() === ".otf" || path.extname(file).toLowerCase() === ".ttf"; //拡張子jpgだけ
          });
        client.emit("getFontList", fontsList);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("getSvgList", () => {
      try {
        const svgList = getSvgFiles();

        client.emit("getSvgList", svgList);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("getUserConfig", () => {
      try {
        const config = getUserConfig();
        // console.log(config);
        // console.log("is loaded");
        client.emit("getUserConfig", config);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("saveUserConfig", (data) => {
      try {
        // console.log("saveするだよ");
        // console.log(data);
        saveUserConfig(data);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("updateUserConfig", (data) => {
      try {
        client.emit("updateUserConfig", data);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("toggleTextAreaEditMode", (status) => {
      // console.log("toggle now", status);
      try {
        client.broadcast.emit("toggleTextAreaEditMode", status);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("selectBubble", (bubbleIndex) => {
      try {
        client.emit("selectBubble", bubbleIndex);
        client.broadcast.emit("selectBubble", bubbleIndex);
      } catch (e) {
        console.log(e);
      }
    });

    client.on("bubbleConfigUpdate", (config) => {
      console.log("update");
      client.emit("bubbleConfigUpdate", config);
      client.broadcast.emit("bubbleConfigUpdate", config);
    });

    client.on("select-font", (selectedFont) => {
      client.emit("select-font", selectedFont);
      client.broadcast.emit("select-font", selectedFont);
    });

    const translateWithDeepl = (text, id) => {
      console.log(`start translate...${id}`);
      translate({
        free_api: true, // ← フリープランのみ記載
        text: text,
        target_lang: LANG,
        auth_key: dotenv.config().parsed.DEEPL_AUTH_KEY, // ここにDeeplのAPIキーを入力
      })
        .then((result) => {
          const enText = result.data.translations[0].text;
          client.emit("translate-text", { text: enText, timeStamp: id });
          client.broadcast.emit("translate-text", { text: enText, timeStamp: id });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const startRecognitionStream = (id) => {
      console.log(`start talking...${id}`);
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on("error", console.error)
        .on("data", (data) => {
          // process.stdout.write(
          //   data.results[0] && data.results[0].alternatives[0]
          //     ? `[${data.results[0] && data.results[0].isFinal}]: ${data.results[0].alternatives[0].transcript}\n`
          //     : "\n\nReached transcription time limit, press Ctrl+C\n"
          // );
          data.timeStamp = id;
          client.emit("speechData", data);
          client.broadcast.emit("speechData", data);
          // if end of utterance, let's restart stream
          // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
          // console.log(activeStopStatus);

          if (data.results[0] && data.results[0].isFinal) {
            console.log(data.results[0].alternatives[0].transcript, ":-----", id);
            translateWithDeepl(data.results[0].alternatives[0].transcript, id);
            if (isAnimationPlaying) {
              client.emit("toggleAnimation", "pause");
              client.broadcast.emit("toggleAnimation", "pause");
              isAnimationPlaying = false;
            }
          } else {
            if (!isAnimationPlaying) {
              client.emit("toggleAnimation", "play");
              client.broadcast.emit("toggleAnimation", "play");
              isAnimationPlaying = true;
            }
          }
        });
    };

    const stopRecognitionStream = () => {
      if (recognizeStream) {
        recognizeStream.end();
      }
      recognizeStream = null;
      client.emit("toggleAnimation", "pause");
      client.broadcast.emit("toggleAnimation", "pause");
      isAnimationPlaying = false;
    };
  });

  // =========================== GOOGLE CLOUD SETTINGS ================================ //

  // The encoding of the audio file, e.g. 'LINEAR16'
  // The sample rate of the audio file in hertz, e.g. 16000
  // The BCP-47 language code to use, e.g. 'en-US'
  const encoding = "LINEAR16";
  const sampleRateHertz = 16000;
  const languageCode = "ja-JP"; //en-US

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      profanityFilter: false,
      enableWordTimeOffsets: true,
      speechContexts: [
        {
          phrases: [],
        },
      ], // add your own speech context for better recognition
    },
    interimResults: true, // If you want interim results, set this to true
    // singleUtterance: true,
  };
};

export default socketServer;
