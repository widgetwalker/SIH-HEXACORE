import { playSirenBeep } from "@/lib/siren";

let latestAlertId: string | number | null = null;
const recentlyAnnounced = new Map<string, number>();
let activeUtterance: SpeechSynthesisUtterance | null = null;
let backendAudioInstance: HTMLAudioElement | null = null;

/**
 * Play synthesized speech directly from the backend /api/v1/mitra/tts WAV stream.
 * Guaranteed fallback across all devices/browsers even without Gemini API or browser speech support.
 */
export async function playBackendAudio(text: string, lang = "en-in"): Promise<boolean> {
  if (typeof window === "undefined" || !text) return false;
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");
    const audioUrl = `${backendUrl}/api/v1/mitra/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;

    if (backendAudioInstance) {
      backendAudioInstance.pause();
      backendAudioInstance.currentTime = 0;
    }

    const audio = new Audio(audioUrl);
    backendAudioInstance = audio;
    audio.volume = 1.0;
    await audio.play();
    return true;
  } catch (err) {
    console.warn("Backend TTS playback error:", err);
    return false;
  }
}

export function speak(text: string, forceBackend = false) {
  if (typeof window === "undefined" || !text) return;

  if (forceBackend) {
    playBackendAudio(text);
    return;
  }

  // Attempt browser speech synthesis first (zero latency)
  if ("speechSynthesis" in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      activeUtterance = utter;
      utter.lang = "en-IN";
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

      utter.onend = () => {
        activeUtterance = null;
      };
      utter.onerror = () => {
        activeUtterance = null;
        // Automatic fallback to backend audio if browser speech synthesis fails
        playBackendAudio(text);
      };

      window.speechSynthesis.speak(utter);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      return;
    } catch {
      // Fallback
    }
  }

  // Fallback if browser does not support speechSynthesis
  playBackendAudio(text);
}

export function announceMitraEmergency(headline: string, detail?: string, alertKey?: string) {
  if (typeof window === "undefined") return;

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

