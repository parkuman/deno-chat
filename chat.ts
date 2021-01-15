import {
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const users = new Map();

function broadcastMessage(message: string, senderId?: string): void {
  if (!message) return;

  for (const user of users.values()) {
    user.ws.send(senderId ? `[${senderId}]: ${message}` : message);
  }
}

export async function chat(ws: WebSocket): Promise<void> {
  const userId = v4.generate();
  console.log(`🔌 ${userId} successfully connected!`);

  users.set(userId, {
    ws: ws,
    // username, pic, contact info, etc.
  });

  broadcastMessage(`> ${userId} joined`);

  for await (const event of ws) {
    if (typeof event === "string") {
      broadcastMessage(event, userId);
    }

    if (isWebSocketCloseEvent(event)) {
      users.delete(userId);
      console.log(`✖ ${userId} disconnected`);
      broadcastMessage(`> ${userId} left`);
    }
  }
}
