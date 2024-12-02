import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

import * as Humanjs from "@vladmandic/human";

const config = {
  backend: "webgl",
  modelBasePath: "file://models/",
  emotion: { enabled: true },
  face: {
    detector: {
      maxDetected: 7,
    },
  },
};
const human = new Humanjs.Human(config);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("image", async (data) => {
    if (!data) {
      return;
    }
    data = Buffer.from(data);
    const tensor = human.tf.node.decodeImage(data);
    const result = await human.detect(tensor);
    // console.log("human result", result);
    socket.emit("data", result);
    // const result = {
    //   emotion: [
    //     {
    //       emotion: "happy",
    //       score: 0.9,
    //     },
    //     {
    //       emotion: "happy",
    //       score: 0.9,
    //     },
    //   ],
    // };
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
