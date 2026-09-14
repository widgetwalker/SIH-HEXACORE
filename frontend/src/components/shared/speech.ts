import { playSirenBeep, stopSiren } from "@/lib/siren";

let latestAlertId: string | number | null = null;
const recentlyAnnounced = new Map<string, number>();
let activeUtterance: SpeechSynthesisUtterance | null = null;
let backendAudioInstance: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let currentSpeechToken = 0;

/**
 * Pre-cache and refresh available browser synthesis voices.
 */
function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices.length > 0 ? cachedVoices : voices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  getAvailableVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    getAvailableVoices();
  };
}

/**
 * Select the highest-clarity natural female voice available.
 * Returns the selected voice and a boolean indicating whether it is a high-grade natural voice.
 */
export function selectClearFemaleVoice(
  voices: SpeechSynthesisVoice[]
): { voice: SpeechSynthesisVoice | null; isHighQuality: boolean } {
  if (!voices || voices.length === 0) return { voice: null, isHighQuality: false };

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -999;

  for (const v of voices) {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    let score = 0;

    // Hard disqualifiers: male voices or harsh mechanical synthesizers
    if (/male|david|mark|george|richard|guy|stefan|paul|frank|fred|bruce|ralph|albert|espeak-default/i.test(name)) {
      continue;
    }

    // Tier 1: Natural / Neural / Studio cloud voices (highest clarity)
    if (/(natural|neural|online|wavenet|studio|journey)/i.test(name)) {
      score += 60;
    }

    // Tier 2: Renowned high-clarity natural female personas
    if (/(neerja|jenny|aria|sonia|samantha|victoria|karen|serena|ava|steffi|fiona|veena|zira|tessa|moira|alice|allison)/i.test(name)) {
      score += 50;
    }

    // Google High-Fidelity browser voices
    if (/google/i.test(name)) {
      score += 35;
      if (/uk english female|female|us english/i.test(name)) score += 25;
    }

    // Explicit female descriptor in voice name or URI
    if (/female|woman/i.test(name) || /female/i.test(v.voiceURI)) {
      score += 35;
    }

    // Language priority: Indian English (Mitra persona), then British / US English
    if (lang.startsWith("en-in")) {
      score += 25;
    } else if (lang.startsWith("en-gb") || lang.startsWith("en-us") || lang.startsWith("en")) {
      score += 15;
    } else {
      score -= 40; // Non-English penalty
    }

    // Heavy penalty for mechanical / raspy Linux fallback engines
    if (/espeak|speech-dispatcher|mbrola|dummy/i.test(name)) {
      score -= 80;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = v;
    }
  }

  // A score >= 25 indicates a genuine, clear female or natural voice is available
  const isHighQuality = bestScore >= 25;
  return { voice: bestVoice, isHighQuality };
}

/**
 * Play crystal-clear synthesized speech directly from the backend /api/v1/mitra/tts stream.
 * Employs Microsoft Neural TTS (en-IN-NeerjaNeural / en-US-JennyNeural) for studio-grade human female speech.
 */
export async function playBackendAudio(text: string, lang = "en-in", token = currentSpeechToken): Promise<boolean> {
  if (typeof window === "undefined" || !text) return false;
  if (token !== currentSpeechToken) return false;
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");
    const audioUrl = `${backendUrl}/api/v1/mitra/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;

    // Cancel any active browser speech synthesis before playing backend audio
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    }

    if (backendAudioInstance) {
      backendAudioInstance.pause();
      backendAudioInstance.currentTime = 0;
      backendAudioInstance.src = "";
      backendAudioInstance = null;
    }

    if (token !== currentSpeechToken) return false;

    const audio = new Audio(audioUrl);
    backendAudioInstance = audio;
    audio.volume = 1.0;
    await audio.play();

    // Check again in case stopSpeaking was clicked while audio was loading/buffering
    if (token !== currentSpeechToken) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Backend neural TTS playback error:", err);
    return false;
  }
}

/**
 * Main speech dispatch:
 * 1. Checks available browser voices.
 * 2. If a high-clarity natural female voice is available, speaks immediately with tuned natural pitch (1.0) and articulate pace (0.96).
 * 3. If only raspy/robotic/espeak voices are installed (common on Linux desktop), automatically uses backend studio neural TTS.
 */
export function speak(text: string, forceBackend = false) {
  if (typeof window === "undefined" || !text) return;

  currentSpeechToken++;
  const token = currentSpeechToken;

  if (forceBackend) {
    playBackendAudio(text, "en-in", token);
    return;
  }

  if ("speechSynthesis" in window) {
    try {
      if (backendAudioInstance) {
        backendAudioInstance.pause();
        backendAudioInstance.currentTime = 0;
        backendAudioInstance.src = "";
        backendAudioInstance = null;
      }

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const voices = getAvailableVoices();
      const { voice: selectedVoice, isHighQuality } = selectClearFemaleVoice(voices);

      // If the browser only has raspy or mechanical robot voices (e.g. Linux default espeak),
      // seamlessly stream the studio neural female voice from the backend instead.
      if (!isHighQuality || !selectedVoice) {
        playBackendAudio(text, "en-in", token);
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      activeUtterance = utter;
      utter.voice = selectedVoice;
      utter.lang = selectedVoice.lang || "en-IN";

      // Tuned parameters for maximum clarity and sensible, warm female cadence:
      // Pitch 1.0 preserves natural human vocal resonance without tinny or raspy distortion
      utter.pitch = 1.0;
      // Rate 0.96 provides deliberate, articulate pronunciation essential for safety messages
      utter.rate = 0.96;
      utter.volume = 1.0;

      utter.onend = () => {
        if (activeUtterance === utter) {
          activeUtterance = null;
        }
      };
      utter.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (activeUtterance === utter) {
          activeUtterance = null;
        }
        // If canceled or interrupted by user / stopSpeaking, DO NOT trigger fallback audio!
        if (token !== currentSpeechToken || e.error === "canceled" || e.error === "interrupted") {
          return;
        }
        playBackendAudio(text, "en-in", token);
      };

      window.speechSynthesis.speak(utter);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      return;
    } catch {
      // Fallback to backend audio on any unexpected browser synthesis error
    }
  }

  // Fallback if browser does not support speechSynthesis
  playBackendAudio(text, "en-in", token);
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
  // If a specific tactical NDMA message is provided, broadcast it directly
  const speechText = cleanDetail
    ? `Emergency alert! ${cleanDetail}`
    : `Emergency alert! Attention all personnel: ${headline}. Initiate campus emergency safety protocols immediately and proceed to safety.`;

  speak(speechText);
}

export function speakAlert(alertId: number | string, message: string) {
  if (alertId === latestAlertId) return;
  latestAlertId = alertId;
  announceMitraEmergency(message, undefined, String(alertId));
}

/**
 * Immediately silences all voice, sound effects, siren beeps, and neural audio streams.
 */
export function stopSpeaking() {
  currentSpeechToken++;
  stopSiren();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    activeUtterance = null;
  }
  if (backendAudioInstance) {
    try {
      backendAudioInstance.pause();
      backendAudioInstance.currentTime = 0;
      backendAudioInstance.src = "";
    } catch {
      /* ignore */
    }
    backendAudioInstance = null;
  }
  latestAlertId = null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && ("speechSynthesis" in window || true);
}


