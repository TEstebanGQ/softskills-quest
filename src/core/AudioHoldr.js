/**
 * AudioHoldr - Procedural 8-bit NES APU sound synthesis & Authentic Super Mario Bros BGM Audio Player.
 * Inspired by FullScreenMario / AudioHoldr / EightBittr.
 *
 * Emulates:
 * - Pulse/Square wave channels (Jump, Block hit, Flagpole)
 * - Sine wave channels (Coins, Clean pickups)
 * - Sawtooth/Noise channels (Stomp, Game Over / Pitfall)
 * - Triangle wave channels (PowerUp reveals, Fanfare)
 * - Authentic 5 Super Mario Soundtrack Songs (Overworld, Desert, Underground, Starman, Castle)
 */
export class AudioHoldr {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.currentTrack = null;
    this.bgmAudio = null;
    this.bgmVolume = 0.45;

    // Track path map for the 5 downloaded Super Mario Bros songs
    this.tracks = {
      'overworld': '/audio/overworld.mp3',
      'autodisciplina': '/audio/overworld.mp3',
      'hub_overworld': '/audio/overworld.mp3',

      'desert': '/audio/desert.mp3',
      'perseverancia': '/audio/desert.mp3',

      'underground': '/audio/underground.mp3',
      'asertividad': '/audio/underground.mp3',

      'twilight': '/audio/starman.mp3',
      'creatividad_innovacion': '/audio/starman.mp3',
      'starman': '/audio/starman.mp3',

      'castle': '/audio/castle.mp3',
      'capacidad_planificacion': '/audio/castle.mp3'
    };
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays the designated Super Mario background music track for the current level/theme.
   */
  playBGM(trackKey) {
    if (typeof window === 'undefined') return;
    const path = this.tracks[trackKey] || this.tracks['overworld'];

    if (this.currentTrack === path && this.bgmAudio && !this.bgmAudio.paused) {
      return;
    }

    this.stopBGM();
    this.currentTrack = path;

    try {
      this.bgmAudio = new Audio(path);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.enabled ? this.bgmVolume : 0;

      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // In case browser autoplay policy suspends playback before first user gesture
          const resumeOnInteract = () => {
            if (this.bgmAudio && this.enabled) {
              this.bgmAudio.play().catch(() => {});
            }
            window.removeEventListener('click', resumeOnInteract);
            window.removeEventListener('keydown', resumeOnInteract);
          };
          window.addEventListener('click', resumeOnInteract);
          window.addEventListener('keydown', resumeOnInteract);
        });
      }
    } catch (e) {
      console.warn('Error playing BGM:', e);
    }
  }

  stopBGM() {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch (e) {}
      this.bgmAudio = null;
    }
    this.currentTrack = null;
  }

  setBGMVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.enabled ? this.bgmVolume : 0;
    }
  }

  // Classic NES APU Square Wave Jump (160Hz -> 580Hz sweep)
  playJump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Classic Dual-Tone Coin Pickup (B5 -> E6)
  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playPickup() {
    this.playCoin();
  }

  // Block Hit (NES APU Square wave pitch drop 220Hz -> 110Hz)
  playBlockHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Power-up Spawning Sound (Triangle wave arpeggio)
  playPowerUpAppears() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.04 + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + i * 0.04 + 0.08);
    });
  }

  playPowerUp() {
    this.playPowerUpAppears();
  }

  // Stomp Goomba (NES APU Sawtooth sweep 180Hz -> 60Hz)
  playStomp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Flagpole Slide Victory Fanfare (NES arpeggio)
  playFlagpole() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    arpeggio.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.2);
    });
  }

  // Checkpoint flag sound (rising positive chime)
  playCheckpoint() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.04 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + i * 0.04 + 0.04);
    });
  }

  playSuccess() {
    this.playFlagpole();
  }

  playFail() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.bgmAudio) {
      if (this.enabled) {
        this.bgmAudio.volume = this.bgmVolume;
        if (this.bgmAudio.paused) this.bgmAudio.play().catch(() => {});
      } else {
        this.bgmAudio.volume = 0;
        this.bgmAudio.pause();
      }
    }
    return this.enabled;
  }
}

export const audioHoldr = new AudioHoldr();
export const audio = audioHoldr;
