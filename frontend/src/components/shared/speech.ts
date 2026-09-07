import { playSirenBeep } from "@/lib/siren";

let latestAlertId: string | number | null = null;
const recentlyAnnounced = new Map<string, number>();

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.02;
  utter.pitch = 1.05;
  utter.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang === "en-IN" && (v.name.includes("Female") || v.name.includes("Natural") || v.name.includes("Google"))) ||
    voices.find((v) => v.lang === "en-IN") ||
    voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google"))) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utter.voice = preferred;

  window.speechSynthesis.speak(utter);
}

export function announceMitraEmergency(headline: string, detail?: string, alertKey?: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const now = Date.now();
  const key = alertKey ?? headline;
  const lastSpoken = recentlyAnnounced.get(key);
  // Do not repeat the exact same alert within 45 seconds
  if (lastSpoken && now - lastSpoken < 45_000) return;
  recentlyAnnounced.set(key, now);

  // Play urgent siren chime before voice
  playSirenBeep();

  const cleanDetail = detail ? detail.replace(/·/g, ",").trim() : "";
  const speechText = `Emergency alert! Attention all personnel: ${headline}. ${cleanDetail ? cleanDetail + "." : ""} Initiate campus emergency safety protocols immediately and proceed to safety.`;

  speak(speechText);
}

export function speakAlert(alertId: number | string, message: string) {
  if (alertId === latestAlertId) return;
  latestAlertId = alertId;
  announceMitraEmergency(message, undefined, String(alertId));
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  latestAlertId = null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

