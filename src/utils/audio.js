// Synthesized Web Audio API Sound Effects for Tactile ASMR Feedback
class SoundFXManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enable) {
    this.enabled = enable !== undefined ? enable : !this.enabled;
    return this.enabled;
  }

  // Cute bubble pop
  playPop(freq = 520) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  // Sparkling chime (when items or charms appear)
  playChime(notes = [523.25, 659.25, 783.99, 1046.50]) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        const startTime = this.ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // silent
    }
  }

  // ASMR Scoop swoosh & gentle charm rattle
  playScoopSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Noise buffer for swoosh
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.2);
      filter.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.35);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.35);

      // Play cute charm clinks
      [800, 1100, 1400, 950].forEach((freq, idx) => {
        setTimeout(() => {
          this.playPop(freq + Math.random() * 200);
        }, 120 + idx * 45);
      });
    } catch {
      // silent
    }
  }

  // Celebratory reward fanfare
  playSuccess() {
    if (!this.enabled) return;
    this.playChime([523.25, 659.25, 783.99, 1046.50, 1318.51]);
  }

  // Cash Register Cha-Ching for New Order alerts
  playCashRegister() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Mechanical cash drawer lever clink
      const oscClick = this.ctx.createOscillator();
      const gainClick = this.ctx.createGain();
      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(360, now);
      oscClick.frequency.exponentialRampToValueAtTime(90, now + 0.05);

      gainClick.gain.setValueAtTime(0.24, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      oscClick.connect(gainClick);
      gainClick.connect(this.ctx.destination);
      oscClick.start(now);
      oscClick.stop(now + 0.06);

      // 2. Twin high-pitched silver bell chime ("Cha-Ching!")
      const bellPitches = [987.77, 1318.51, 1975.53]; // B5, E6, B6
      bellPitches.forEach((pitch, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + 0.05 + i * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.55);
      });
    } catch {
      // Audio fallback silent
    }
  }
}

export const soundFX = new SoundFXManager();

