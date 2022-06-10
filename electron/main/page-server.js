var http = require("http");
var path = require("path");
var fs = require("fs");

const mimeTypes = { ".js": "text/javascript", ".html": "text/html", ".css": "text/css", ".svg": "image/svg+xml ", ".ttf": "application/x-font-ttf", ".otf": "application/x-font-otf" };

const mode = process.env["MODE"];
const basePath = mode === "development" ? "." : "./resources/app/dist";

const startWebServer = () => {
  if (mode === "development") {
    console.log("additional web server would not be started in development mode");
  } else {
    http
      .createServer(function (request, response) {
        if (request.url === "/favicon.ico") {
          response.writeHead(404);
          response.end("Not found.");
          return;
        }
        var lookupPath = path.basename(decodeURI(request.url)) || "index.html",
          f = `${basePath}/${path.extname(lookupPath) === ".otf" || path.extname(lookupPath) === ".ttf" ? "fonts/" : ""}${lookupPath}`;
        fs.exists(f, function (exists) {
          if (exists) {
            fs.readFile(f, function (err, data) {
              if (err) {
                response.writeHead(500);
                response.end("Server Error!");
                return;
              }
              var headers = { "Content-Type": mimeTypes[path.extname(f)] };
              response.writeHead(200, headers);
              response.end(data);
            });
            return;
          }
          response.writeHead(404);
          response.end("Not found." + f);
        });
      })
      .listen(4000);
  }
};

export default startWebServer;
