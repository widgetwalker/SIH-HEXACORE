/**
 * Cross-tab BroadcastChannel bus for drill telemetry.
 *
 * When a student runs a drill on /simulate, their EvacuationGame sends
 * telemetry frames on this channel so an open /command tab can consume
 * them without needing the backend WebSocket.
 */

export interface DrillTelemetryFrame {
  user_id: string;
  floor: number;
  cell: [number, number];
  status: string;
}

const CHANNEL_NAME = "safezone_drill_events";

export function publishDrillEvent(frame: DrillTelemetryFrame): void {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
  try {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage(frame);
    ch.close();
  } catch {
    // Silently ignore — BroadcastChannel may be unavailable in some contexts.
  }
}

export function subscribeDrillEvents(
  onFrame: (frame: DrillTelemetryFrame) => void,
): () => void {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return () => {};
  }
  const ch = new BroadcastChannel(CHANNEL_NAME);
  const handler = (event: MessageEvent<DrillTelemetryFrame>) => {
    if (event.data && typeof event.data.user_id === "string") {
      onFrame(event.data);
    }
  };
  ch.addEventListener("message", handler);
  return () => {
    ch.removeEventListener("message", handler);
    ch.close();
  };
}
