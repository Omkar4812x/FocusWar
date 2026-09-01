// Web Audio API Sound Synthesizer for FocusWar

let audioCtx = null;
let activeAmbientSource = null;
let activeAmbientGain = null;
let currentVolume = 0.5;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
  Plays a victory chime synth sound when focus session completes.
 */
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pleasant 4-note harmonic victory arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.01, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.85);
    });
  } catch (err) {
    console.warn('Audio chime error:', err);
  }
}

/**
 * Adjusts ambient audio volume (0.0 to 1.0)
 */
export function setAmbientVolume(vol) {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (activeAmbientGain) {
    activeAmbientGain.gain.value = currentVolume * 0.5;
  }
}

/**
  Starts or stops ambient focus background soundscapes.
 */
export function setAmbientSound(type, volume = currentVolume) {
  try {
    // Stop existing sound
    if (activeAmbientSource) {
      activeAmbientSource.stop();
      activeAmbientSource.disconnect();
      activeAmbientSource = null;
    }
    if (activeAmbientGain) {
      activeAmbientGain.disconnect();
      activeAmbientGain = null;
    }

    if (!type || type === 'none') return;

    const ctx = getAudioContext();
    if (!ctx) return;

    currentVolume = volume;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'rain' || type === 'whitenoise' || type === 'forest' || type === 'cafe') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink noise rain simulation
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        } else if (type === 'forest') {
          // Forest wind algorithm: slow modulated low noise
          const t = i / ctx.sampleRate;
          const modulation = 0.7 + 0.3 * Math.sin(2 * Math.PI * 0.2 * t);
          b0 = 0.99 * b0 + white * 0.05;
          data[i] = b0 * 0.05 * modulation;
        } else if (type === 'cafe') {
          // Cozy cafe ambience simulation: soft multi-layered noise
          b0 = 0.95 * b0 + white * 0.08;
          b1 = 0.90 * b1 + white * 0.10;
          data[i] = (b0 + b1) * 0.025;
        } else {
          // Soft white noise
          data[i] = white * 0.03;
        }
      }
    } else if (type === 'binaural' || type === 'deepsynth') {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        if (type === 'deepsynth') {
          // Cosmic deep focus synth pad
          data[i] = Math.sin(2 * Math.PI * 110 * t) * 0.04 + Math.sin(2 * Math.PI * 164.81 * t) * 0.03 + Math.sin(2 * Math.PI * 220 * t) * 0.02;
        } else {
          // Binaural beats (Alpha wave focus 136.1Hz & 140.1Hz)
          data[i] = Math.sin(2 * Math.PI * 136.1 * t) * 0.05 + Math.sin(2 * Math.PI * 140.1 * t) * 0.05;
        }
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = currentVolume * 0.5;

    noiseSource.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    activeAmbientSource = noiseSource;
    activeAmbientGain = gainNode;
  } catch (err) {
    console.warn('Ambient sound error:', err);
  }
}

