import { playSirenBeep, stopSiren } from "@/lib/siren";

let latestAlertId: string | number | null = null;
const recentlyAnnounced = new Map<string, number>();
let activeUtterance: SpeechSynthesisUtterance | null = null;
let backendAudioInstance: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let currentSpeechToken = 0;

let sharedAudio: HTMLAudioElement | null = null;
let isAudioUnlocked = false;

/**
 * Prime and unlock HTML5 audio element on user gesture so that
 * asynchronous speech playback (e.g. after Mitra chat AI inference)
 * is never blocked by browser autoplay policy.
 */
export function unlockAudioPlayer() {
  if (typeof window === "undefined") return;
  if (!sharedAudio) {
    sharedAudio = new Audio();
  }
  if (!isAudioUnlocked) {
    sharedAudio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    sharedAudio.play().then(() => {
      isAudioUnlocked = true;
      if (sharedAudio) {
        sharedAudio.pause();
        sharedAudio.currentTime = 0;
      }
    }).catch(() => {
      /* ignore */
    });
  }
}

if (typeof window !== "undefined") {
  const onFirstInteraction = () => {
    unlockAudioPlayer();
    window.removeEventListener("click", onFirstInteraction);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("touchstart", onFirstInteraction);
  };
  window.addEventListener("click", onFirstInteraction, { once: true, passive: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true, passive: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
}

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
 * Requires an explicit female or natural neural indicator to prevent
 * selecting robotic Linux default synthesizers (e.g. espeak).
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

    // 1. Hard disqualifiers: male voices or harsh mechanical synthesizers
    if (
      /male|david|mark|george|richard|guy|stefan|paul|frank|fred|bruce|ralph|albert|espeak|speech-dispatcher|mbrola|festival|dummy|mechanical/i.test(
        name
      ) ||
      /espeak|speech-dispatcher|mbrola/i.test(v.voiceURI)
    ) {
      continue;
    }

    // 2. Strict Requirement: MUST have an explicit female or neural/natural indicator
    const isNaturalOrNeural = /(natural|neural|online|wavenet|studio|journey)/i.test(name);
    const isKnownFemalePersona = /(neerja|jenny|aria|sonia|samantha|victoria|karen|serena|ava|steffi|fiona|veena|zira|tessa|moira|alice|allison)/i.test(name);
    const isExplicitFemale = /female|woman/i.test(name) || /female|woman/i.test(v.voiceURI);
    const isGoogleFemale = /google/i.test(name) && /uk english female|female|us english/i.test(name);

    if (!isNaturalOrNeural && !isKnownFemalePersona && !isExplicitFemale && !isGoogleFemale) {
      // Reject any generic, unidentified, or robotic voices (such as default Linux speech-dispatcher)
      continue;
    }

    let score = 0;
    if (isNaturalOrNeural) score += 60;
    if (isKnownFemalePersona) score += 50;
    if (isExplicitFemale) score += 35;
    if (isGoogleFemale) score += 30;

    // Language priority: Indian English (Mitra persona), then British / US English
    if (lang.startsWith("en-in")) {
      score += 25;
    } else if (lang.startsWith("en-gb") || lang.startsWith("en-us") || lang.startsWith("en")) {
      score += 15;
    } else {
      score -= 40; // Non-English penalty
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = v;
    }
  }

  // Only consider high quality if an explicit natural/female voice was verified
  const isHighQuality = bestScore >= 35 && bestVoice !== null;
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

    // 8-second timeout to allow Edge Neural TTS synthesis and streaming
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
    }, 8000);

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

      // Reuse pre-unlocked HTMLAudioElement if available to guarantee autoplay compliance
      const audio = sharedAudio || new Audio();
      backendAudioInstance = audio;
      audio.volume = 1.0;

      const onPlaying = () => {
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("error", onError);
        if (token === currentSpeechToken) {
          finish(true);
        } else {
          audio.pause();
          audio.removeAttribute("src");
          finish(false);
        }
      };

      const onError = () => {
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("error", onError);
        finish(false);
      };

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("error", onError);
      audio.src = audioUrl;
      audio.load();

      audio.play().catch(() => {
        onError();
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
      backendAudioInstance.removeAttribute("src");
      backendAudioInstance.load();
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


