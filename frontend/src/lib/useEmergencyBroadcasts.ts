"use client";

import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "./liveAlerts";

export interface EmergencyBroadcast {
  type: "EMERGENCY_BROADCAST";
  severity: string;
  msg: string;
  receivedAt: number;
}

/**
 * Joins the campus WebSocket room and surfaces every EMERGENCY_BROADCAST
 * the server sends - used by both /command (to display + drive the siren)
 * and /simulate (so Mitra can verbalize the warning). Connection failures
 * degrade silently: `connected` just stays false, no user-visible error.
 */
export function useEmergencyBroadcasts(
  campusId = process.env.NEXT_PUBLIC_CAMPUS_ID ?? "CAMPUS-01",
) {
  const [broadcasts, setBroadcasts] = useState<EmergencyBroadcast[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket;
    const token = process.env.NEXT_PUBLIC_WS_TOKEN;
    if (!token || typeof window === "undefined" || !window.WebSocket) return;

    try {
      const wsUrl = `${BACKEND_URL.replace(/^http/, "ws")}/api/v1/ws`;
      socket = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);
    } catch {
      return;
    }
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ type: "JOIN_CAMPUS", campus_id: campusId }));
    };
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === "EMERGENCY_BROADCAST") {
          setBroadcasts((prev) => [{ ...data, receivedAt: Date.now() }, ...prev].slice(0, 20));
        }
      } catch {
        /* malformed frame - ignore */
      }
    };

    return () => {
      socket.close();
    };
  }, [campusId]);

  return { broadcasts, connected };
}
