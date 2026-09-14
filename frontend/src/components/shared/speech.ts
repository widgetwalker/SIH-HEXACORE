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
    if (
      /male|david|mark|george|richard|guy|stefan|paul|frank|fred|bruce|ralph|albert|espeak|speech-dispatcher|mbrola|festival|dummy/i.test(
        name
      )
    ) {
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
  const isHighQuality = bestScore >= 25 && bestVoice !== null;
  return { voice: bestVoice, isHighQuality };
}

/**
 * Play crystal-clear synthesized speech directly from the Microsoft Neural TTS stream (/api/mitra/tts).
 * Employs Microsoft Neural TTS (en-IN-NeerjaNeural) for studio-grade human female speech.
 */
export async function playBackendAudio(text: string, lang = "en-in", token = currentSpeechToken): Promise<boolean> {
  if (typeof window === "undefined" || !text) return false;
  if (token !== currentSpeechToken) return false;

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (result: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutTimer);
      resolve(result);
    };

    // Strict 3.5s network timeout: immediately fall back if neural stream does not begin
    const timeoutTimer = setTimeout(() => {
      if (backendAudioInstance) {
        try {
          backendAudioInstance.pause();
          backendAudioInstance.src = "";
        } catch {
          /* ignore */
        }
      }
      finish(false);
    }, 3500);

    try {
      // Direct same-origin Next.js endpoint: synthesizes Microsoft Neural en-IN-NeerjaNeural
      // Same-origin URL guarantees zero mixed-content errors on HTTPS and zero localhost connection issues
      const audioUrl = `/api/mitra/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;

      // Cancel any active browser speech synthesis before playing neural audio
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
        activeUtterance = null;
      }

      if (backendAudioInstance) {
        backendAudioInstance.pause();
        backendAudioInstance.currentTime = 0;
        backendAudioInstance.src = "";
        backendAudioInstance = null;
      }

      if (token !== currentSpeechToken) {
        finish(false);
        return;
      }

      const audio = new Audio(audioUrl);
      backendAudioInstance = audio;
      audio.volume = 1.0;

      audio.addEventListener(
        "playing",
        () => {
          if (token === currentSpeechToken) {
            finish(true);
          } else {
            audio.pause();
            audio.src = "";
            finish(false);
          }
        },
        { once: true }
      );

      audio.addEventListener(
        "error",
        () => {
          finish(false);
        },
        { once: true }
      );

      audio.play().catch(() => {
        finish(false);
      });
    } catch {
      finish(false);
    }
  });
}

/**
 * Main speech dispatch:
 * Strictly locked to the decided Microsoft Neural Indian English female voice (en-IN-NeerjaNeural).
 * Immediately terminates any active speech before speaking so voices never collide or overlap.
 * Completely prohibits raspy robotic synthesizers (espeak).
 */
export function speak(text: string) {
  if (typeof window === "undefined" || !text) return;

  // Immediately cancel any ongoing speech so no two voices or lines ever overlap
  stopSpeaking();

  currentSpeechToken++;
  const token = currentSpeechToken;

  // Primary: Always stream the decided studio neural female voice (en-IN-NeerjaNeural)
  playBackendAudio(text, "en-in", token).then((success) => {
    if (!success && typeof window !== "undefined" && "speechSynthesis" in window) {
      if (token !== currentSpeechToken) return;

      let voices = getAvailableVoices();
      if (voices.length === 0 && "speechSynthesis" in window) {
        voices = window.speechSynthesis.getVoices();
      }
      const { voice: femaleVoice, isHighQuality } = selectClearFemaleVoice(voices);

      // STRICT USER REQUIREMENT:
      // Absolutely NEVER fall back to raspy robotic synthesizers (espeak) or male voices.
      // If no natural high-quality female voice is installed on this device, suppress voice rather than sound robotic.
      if (!femaleVoice || !isHighQuality) {
        return;
      }

      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = femaleVoice;
        utter.lang = femaleVoice.lang || "en-IN";
        utter.pitch = 1.05;
        utter.rate = 0.96;
        activeUtterance = utter;
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utter);
      } catch {
        /* ignore */
      }
    }
  });
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


