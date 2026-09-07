/** Short synthesized siren sweep (Web Audio, no asset file needed). */
export function playSirenBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
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
    osc.onended = () => ctx.close();
  } catch {
    /* Web Audio unavailable - non-fatal */
  }
}
