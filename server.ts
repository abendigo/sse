import http from "node:http";
import url from "node:url";
import fs from "node:fs";

const port = 8000;

http
  .createServer(async (req, res) => {
    // get URI path
    const uri = url.parse(req.url).pathname;

    // return response
    switch (uri) {
      case "/":
        const stream = fs.createReadStream("index.html");
        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
        stream.pipe(res);
        break;
      case "/random":
        sseStart(res);
        sseRandom(res);
        break;
    }
  })
  .listen(port);

// SSE head
function sseStart(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
}

// SSE random number
function sseRandom(res) {
  res.write("data: " + (Math.floor(Math.random() * 1000) + 1) + "\n\n");
  setTimeout(() => sseRandom(res), Math.random() * 3000);
}

console.log(`server running: http://localhost:${port}\n\n`);
