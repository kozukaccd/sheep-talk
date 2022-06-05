const PORT = 5098;
const app = require("express")();
const http = require("http").createServer(app);

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
  console.log(`User connected ${client.id}`);

  console.log("Client Connected to server");
  let recognizeStream = null;

  client.on("join", function () {
    client.emit("messages", "Socket Connected to Server");
  });

  client.on("messages", function (data) {
    client.emit("broad", data);
  });

  client.on("startGoogleCloudStream", function (data) {
    startRecognitionStream(this, data);
  });

  client.on("endGoogleCloudStream", function () {
    stopRecognitionStream();
  });

  client.on("binaryData", function (data) {
    console.log(data); //log binary data
    // if (recognizeStream !== null) {
    //   recognizeStream.write(data);
    // }
  });

  function startRecognitionStream(client) {
    recognizeStream = speechClient
      .streamingRecognize(request)
      .on("error", console.error)
      .on("data", (data) => {
        process.stdout.write(
          data.results[0] && data.results[0].alternatives[0] ? `Transcription: ${data.results[0].alternatives[0].transcript}\n` : "\n\nReached transcription time limit, press Ctrl+C\n"
        );
        client.emit("speechData", data);

        // if end of utterance, let's restart stream
        // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
        if (data.results[0] && data.results[0].isFinal) {
          stopRecognitionStream();
          startRecognitionStream(client);
          // console.log('restarted stream serverside');
        }
      });
  }

  function stopRecognitionStream() {
    if (recognizeStream) {
      recognizeStream.end();
    }
    recognizeStream = null;
  }
});
