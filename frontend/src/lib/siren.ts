let activeSirenCtx: AudioContext | null = null;
let activeOsc: OscillatorNode | null = null;

/** Immediately stop and clean up any playing siren sound */
export function stopSiren() {
  try {
    if (activeOsc) {
      activeOsc.stop();
      activeOsc.disconnect();
      activeOsc = null;
    }
    if (activeSirenCtx && activeSirenCtx.state !== "closed") {
      activeSirenCtx.close();
      activeSirenCtx = null;
    }
  } catch {
    /* Web Audio cleanup error ignored */
  }
}

/** Short synthesized siren sweep (Web Audio, no asset file needed). */
export function playSirenBeep() {
  try {
    stopSiren();
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    activeSirenCtx = ctx;
    const osc = ctx.createOscillator();
    activeOsc = osc;
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
    osc.onended = () => {
      stopSiren();
    };
  } catch {
    /* Web Audio unavailable - non-fatal */
  }
}
