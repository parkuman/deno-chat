import { listenAndServe } from "https://deno.land/std/http/server.ts";
import { acceptable, acceptWebSocket } from "https://deno.land/std/ws/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { chat } from "./chat.ts";

const DEFAULT_PORT = 8000;
const argPort = parse(Deno.args).port;
const port = argPort ? Number(argPort) : DEFAULT_PORT;

listenAndServe({ port }, async (req) => {
  // serve the webpage if the request url is /
  if (req.method === "GET" && req.url == "/") {
    req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      body: await Deno.open("./dist/index.html"),
    });
  }

  // serve the websocket
  if (req.method === "GET" && req.url === "/ws") {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      }).then(chat);
    }
  }
});

console.log(`server is running on localhost:${port}`);
