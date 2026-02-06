import { io, Socket } from "socket.io-client";
import type { SocketLogEvent, SocketBlockedEvent, SocketIncidentEvent } from "@/types/api";

const SOCKET_URL = "http://localhost:8000";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Event listeners
export const onNewLog = (callback: (log: SocketLogEvent) => void) => {
  const s = getSocket();
  if (s) s.on("log:new", callback);
};

export const onAttackBlocked = (callback: (data: SocketBlockedEvent) => void) => {
  const s = getSocket();
  if (s) s.on("attack:blocked", callback);
};

export const onIncidentUpdate = (callback: (data: SocketIncidentEvent) => void) => {
  const s = getSocket();
  if (s) s.on("incident:update", callback);
};

export const onIncidentNew = (callback: (incident: any) => void) => {
  const s = getSocket();
  if (s) s.on("incident:new", callback);
};

// Remove listeners
export const offNewLog = (callback?: (log: SocketLogEvent) => void) => {
  const s = getSocket();
  if (s) s.off("log:new", callback);
};

export const offAttackBlocked = (callback?: (data: SocketBlockedEvent) => void) => {
  const s = getSocket();
  if (s) s.off("attack:blocked", callback);
};

export const offIncidentUpdate = (callback?: (data: SocketIncidentEvent) => void) => {
  const s = getSocket();
  if (s) s.off("incident:update", callback);
};
