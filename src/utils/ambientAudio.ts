// Pure Web Audio API romantic music-box & warm midnight pad synthesizer.
// Zero external audio files required; starts strictly on explicit user tap.

class RomanticAmbientAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private step = 0;

  private readonly melody: Array<{ freq: number; bass?: number; dur: number }> = [
    { freq: 587.33, bass: 146.83, dur: 1.6 },
    { freq: 739.99, dur: 1.2 },
    { freq: 880.0, dur: 1.4 },
    { freq: 659.25, bass: 123.47, dur: 1.8 },
    { freq: 587.33, dur: 1.2 },
    { freq: 493.88, dur: 1.4 },
    { freq: 440.0, bass: 110.0, dur: 1.8 },
    { freq: 587.33, dur: 1.2 },
    { freq: 659.25, dur: 1.2 },
    { freq: 739.99, bass: 98.0, dur: 1.8 },
    { freq: 880.0, dur: 1.3 },
    { freq: 739.99, dur: 1.3 },
    { freq: 659.25, bass: 110.0, dur: 1.6 },
    { freq: 587.33, dur: 2.2 },
  ];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    return this.start();
  }

  public start(): boolean {
    if (this.isPlaying) return true;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtx) return false;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      this.isPlaying = true;
      this.step = 0;

      const beginPlayback = () => {
        if (!this.isPlaying || !this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0.0001, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.24, now + 1.0);
        this.scheduleNextNote();
      };

      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().then(beginPlayback).catch(() => {
          this.isPlaying = false;
        });
      } else {
        beginPlayback();
      }

      return true;
    } catch {
      this.isPlaying = false;
      return false;
    }
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      } catch {
        // Ignore audio scheduling errors during teardown
      }
    }
  }

  private scheduleNextNote(): void {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    if (document.hidden) {
      this.timerId = window.setTimeout(() => this.scheduleNextNote(), 900);
      return;
    }

    const note = this.melody[this.step % this.melody.length];
    this.playCelestaNote(note.freq, 0.18, note.dur + 1.2);

    if (note.bass) {
      this.playWarmPad(note.bass, 0.14, note.dur * 2.1);
    }

    this.step += 1;
    const intervalMs = Math.round(note.dur * 680);
    this.timerId = window.setTimeout(() => this.scheduleNextNote(), intervalMs);
  }

  private playCelestaNote(freq: number, volume: number, duration: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);
    overtoneGain.gain.setValueAtTime(0.14, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.035);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.05);
    overtone.stop(now + duration + 0.05);
  }

  private playWarmPad(freq: number, volume: number, duration: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const padGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, now);

    padGain.gain.setValueAtTime(0.0001, now);
    padGain.gain.linearRampToValueAtTime(volume, now + 0.65);
    padGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(padGain);
    padGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  public dispose(): void {
    this.stop();
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

export const ambientAudio = new RomanticAmbientAudio();
