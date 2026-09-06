/**
 * Client-side Drill Event Bus (BroadcastChannel bridge).
 *
 * When a backend WebSocket is unavailable, this module relays DRILL_TELEMETRY
 * frames between the SimulatePage (publisher) and CommandPage (subscriber)
 * across browser tabs — mimicking what a real WebSocket hub would do.
 *
 * When NEXT_PUBLIC_WS_URL is set, both sides use the real socket instead.
 */

const CHANNEL_NAME = "drill_telemetry";

export interface DrillTelemetryFrame {
  type: "DRILL_TELEMETRY";
  user_id: string;
  floor: number;
  cell: [number, number];
  status: string;
  /** ISO timestamp added by the publisher */
  ts: string;
}

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
}

/**
 * Publish a drill telemetry frame to all listeners (other tabs).
 * The publisher's own tab also receives the message.
 */
export function publishDrillEvent(frame: DrillTelemetryFrame): void {
  try {
    getChannel().postMessage(frame);
  } catch {
    // BroadcastChannel may be unavailable in some environments
  }
}

/**
 * Subscribe to drill telemetry frames.
 * Returns an unsubscribe function.
 * Ignores frames published by the same `excludeUserId` (the local player).
 */
export function subscribeDrillEvents(
  handler: (frame: DrillTelemetryFrame) => void,
  excludeUserId?: string,
): () => void {
  const ch = getChannel();
  const listener = (event: MessageEvent<DrillTelemetryFrame>) => {
    const frame = event.data;
    if (frame?.type !== "DRILL_TELEMETRY") return;
    if (excludeUserId && frame.user_id === excludeUserId) return;
    handler(frame);
  };
  ch.addEventListener("message", listener);
  return () => ch.removeEventListener("message", listener);
}

/**
 * Clean up the shared channel (call on app unmount).
 */
export function destroyDrillEventBus(): void {
  if (channel) {
    channel.close();
    channel = null;
  }
}
