type SoundName = 'tap' | 'success' | 'error' | 'reward' | 'levelUp' | 'whoosh' | 'pop' | 'coin' | 'star' | 'win' | 'lose' | 'unlock';

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private musicMuted = false;
  private musicTimer: number | null = null;

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) this.stopMusic();
  }
  setMusicMuted(m: boolean) {
    this.musicMuted = m;
    if (m) this.stopMusic();
  }
  isMuted() { return this.muted; }
  isMusicMuted() { return this.musicMuted; }

  play(name: SoundName) {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const configs: Record<SoundName, { freq: number; type: OscillatorType; dur: number; vol: number; slide?: number }> = {
      tap: { freq: 600, type: 'sine', dur: 0.08, vol: 0.15 },
      pop: { freq: 800, type: 'sine', dur: 0.1, vol: 0.2, slide: 1200 },
      success: { freq: 523, type: 'sine', dur: 0.15, vol: 0.25, slide: 784 },
      error: { freq: 200, type: 'sawtooth', dur: 0.2, vol: 0.15, slide: 120 },
      reward: { freq: 659, type: 'triangle', dur: 0.3, vol: 0.25, slide: 988 },
      levelUp: { freq: 523, type: 'triangle', dur: 0.4, vol: 0.25, slide: 1047 },
      whoosh: { freq: 400, type: 'sine', dur: 0.2, vol: 0.12, slide: 800 },
      coin: { freq: 988, type: 'square', dur: 0.08, vol: 0.15, slide: 1319 },
      star: { freq: 784, type: 'triangle', dur: 0.2, vol: 0.2, slide: 1175 },
      win: { freq: 523, type: 'triangle', dur: 0.5, vol: 0.3, slide: 1047 },
      lose: { freq: 330, type: 'sine', dur: 0.4, vol: 0.2, slide: 165 },
      unlock: { freq: 440, type: 'triangle', dur: 0.35, vol: 0.25, slide: 880 },
    };
    const c = configs[name];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = c.type;
    osc.frequency.setValueAtTime(c.freq, now);
    if (c.slide) osc.frequency.exponentialRampToValueAtTime(c.slide, now + c.dur);
    gain.gain.setValueAtTime(c.vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + c.dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + c.dur);
  }

  startMusic() {
    if (this.musicMuted || this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.stopMusic();
    const melody = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 392.0];
    let i = 0;
    const playNote = () => {
      if (this.musicMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = melody[i % melody.length];
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.7);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
      i++;
    };
    playNote();
    this.musicTimer = window.setInterval(playNote, 500);
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sound = new SoundManager();
