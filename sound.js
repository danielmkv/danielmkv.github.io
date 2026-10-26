// Tiny synthesized sounds: no downloads, looping files, or audio dependencies.
const soundButton = document.querySelector('#sound-toggle');
let audio;
let motor;
let noise;
let soundEnabled = true;
try { soundEnabled = localStorage.getItem('portfolio-sound') !== 'off'; } catch {}

function showSoundState() {
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  soundButton.textContent = soundEnabled ? 'Sound on' : 'Sound off';
}
showSoundState();

function startAudio() {
  if (audio) return;
  audio = new AudioContext();
  motor = audio.createGain();
  motor.gain.value = 0;
  motor.connect(audio.destination);

  // A soft mains hum with a little mechanical resonance, kept well below clicks.
  for (const [frequency, level] of [[60, .012], [120, .004], [180, .0015]]) {
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.frequency.value = frequency;
    volume.gain.value = level;
    tone.connect(volume).connect(motor);
    tone.start();
  }

  noise = audio.createBuffer(1, audio.sampleRate * .04, audio.sampleRate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
}

function updateMotor() {
  if (!audio) return;
  const powered = document.querySelector('#light-toggle').getAttribute('aria-pressed') === 'true';
  const audible = soundEnabled && powered && !document.hidden && !document.body.classList.contains('reading');
  // Ramping avoids a pop when the lamp switches or the tab loses visibility.
  motor.gain.setTargetAtTime(audible ? 1 : 0, audio.currentTime, .08);
}

function clickSound(isPowerSwitch) {
  const now = audio.currentTime;
  const source = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const envelope = audio.createGain();
  source.buffer = noise;
  filter.type = 'bandpass';
  filter.frequency.value = isPowerSwitch ? 950 : 2200;
  filter.Q.value = .8;
  envelope.gain.setValueAtTime(isPowerSwitch ? .16 : .09, now);
  envelope.gain.exponentialRampToValueAtTime(.0001, now + .035);
  source.connect(filter).connect(envelope).connect(audio.destination);
  source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect(); };
  source.start(now);
}

// Click also covers keyboard activation. Never play sound just from hovering.
document.addEventListener('click', async event => {
  const control = event.target.closest('button, a');
  if (!event.isTrusted || !control || control.classList.contains('skip-link')) return;
  if (control === soundButton) {
    soundEnabled = !soundEnabled;
    showSoundState();
    try { localStorage.setItem('portfolio-sound', soundEnabled ? 'on' : 'off'); } catch {}
  }
  try {
    if (soundEnabled) {
      startAudio();
      await audio.resume();
      // A second click may have muted sound while the browser was resuming.
      if (soundEnabled && !document.hidden) clickSound(control.id === 'light-toggle');
    }
    updateMotor();
  } catch {
    // Audio support or browser policy must never interrupt portfolio navigation.
  }
});
document.addEventListener('visibilitychange', updateMotor);
