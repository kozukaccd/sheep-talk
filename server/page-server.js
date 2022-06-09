var http = require("http");
var path = require("path");
var fs = require("fs");

const mimeTypes = {
  ".js": "text/javascript",
  ".html": "text/html",
  ".css": "text/css",
};

export const startWebServer = () => {
  http
    .createServer(function (request, response) {
      if (request.url === "/favicon.ico") {
        response.writeHead(404);
        response.end("Not found.");
        return;
      }
      var lookup = path.basename(decodeURI(request.url)) || "index.html",
        f = "content/" + lookup;
      fs.exists(f, function (exists) {
        if (exists) {
          fs.readFile(f, function (err, data) {
            if (err) {
              response.writeHead(500);
              response.end("Server Error!");
              return;
            }
            var headers = { "Cpntent-Type": mimeTypes[path.extname(f)] };
            response.writeHead(200, headers);
            response.end(data);
          });
          return;
        }
        response.writeHead(404);
        response.end("Nod found.");
      });
    })
    .listen(1337);
};
