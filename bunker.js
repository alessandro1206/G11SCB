// ============================================================================
// G11-SCB // BLAST DOOR CONTROL TERMINAL MK-IV
// Target Sequence: ☢️ (5) | ⚙️ (7) | 🔺 (8) | ☣️ (5) | ❄️ (6) | ☢️ (5)
// ============================================================================

const TARGET_SEQUENCE = ['5', '7', '8', '5', '6', '5'];

let state = {
  slots: ['', '', '', '', '', ''],
  activeSlot: 0,
  unlocked: false,
  sfxEnabled: true
};

// ============================================================================
// REALISTIC INDUSTRIAL SOUND SYNTHESIZER (WEB AUDIO API)
// ============================================================================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Mechanical switch transient click + piezo tone
function playMechKeySound(digit) {
  if (!state.sfxEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Short mechanical switch click impulse
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'square';
  clickOsc.frequency.setValueAtTime(140, now);
  clickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.025);
  clickGain.gain.setValueAtTime(0.18, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.026);

  // 2. High-tech piezo key beep
  const beepOsc = ctx.createOscillator();
  const beepGain = ctx.createGain();
  const freq = 680 + (parseInt(digit, 10) || 0) * 42;
  beepOsc.type = 'triangle';
  beepOsc.frequency.setValueAtTime(freq, now + 0.01);
  beepGain.gain.setValueAtTime(0.12, now + 0.01);
  beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
  beepOsc.connect(beepGain);
  beepGain.connect(ctx.destination);
  beepOsc.start(now + 0.01);
  beepOsc.stop(now + 0.08);
}

function playControlClick() {
  if (!state.sfxEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(420, now);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.065);
}

function playAlarmBuzzer() {
  if (!state.sfxEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  [0, 0.2].forEach((offset, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(i === 0 ? 185 : 145, now + offset);
    gain.gain.setValueAtTime(0.22, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.17);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.18);
  });
}

function playAirlockUnlockSound() {
  if (!state.sfxEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Heavy mechanical bolt thud
  const boltOsc = ctx.createOscillator();
  const boltGain = ctx.createGain();
  boltOsc.type = 'sine';
  boltOsc.frequency.setValueAtTime(110, now);
  boltOsc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
  boltGain.gain.setValueAtTime(0.3, now);
  boltGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
  boltOsc.connect(boltGain);
  boltGain.connect(ctx.destination);
  boltOsc.start(now);
  boltOsc.stop(now + 0.37);

  // Ascending confirmation chime
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const start = now + 0.15 + idx * 0.11;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.16, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.23);
  });
}

// ============================================================================
// UI RENDER & TERMINAL UPDATES
// ============================================================================
function appendCrtLog(prefix, message, isHighlight = false) {
  const logContainer = document.getElementById('crtLog');
  if (!logContainer) return;

  const p = document.createElement('p');
  p.className = isHighlight ? 'log-line highlight' : 'log-line';
  p.innerHTML = `<span class="log-prefix">[${prefix}]</span> ${message}`;
  logContainer.appendChild(p);

  // Keep max 5 lines in CRT monitor so it stays clean
  while (logContainer.children.length > 5) {
    logContainer.removeChild(logContainer.firstChild);
  }
}

function renderConsole() {
  const cells = document.querySelectorAll('#sequenceGrid .seq-cell');
  cells.forEach((cell, idx) => {
    const val = state.slots[idx];
    const digitEl = document.getElementById(`digit-slot-${idx}`);
    digitEl.textContent = val !== '' ? val : '-';

    cell.classList.toggle('active', !state.unlocked && idx === state.activeSlot);
    cell.classList.toggle('filled', val !== '');
    cell.classList.toggle('verified', state.unlocked);
  });

  const lockModule = document.getElementById('lockModule');
  const securityChip = document.getElementById('securityChip');
  const keypadDeck = document.getElementById('keypadDeck');
  const unlockedChamber = document.getElementById('unlockedChamber');
  const doorLamp = document.getElementById('doorStatusLamp');
  const doorText = document.getElementById('doorStatusText');

  if (state.unlocked) {
    lockModule.classList.add('unlocked-state');
    securityChip.textContent = '🔓 OVERRIDE ACCEPTED';
    securityChip.className = 'security-chip unlocked';
    keypadDeck.style.display = 'none';
    unlockedChamber.classList.remove('hidden');
    doorLamp.className = 'led-lamp led-green';
    doorText.textContent = 'UNSEALED';
  } else {
    lockModule.classList.remove('unlocked-state');
    securityChip.textContent = '🔒 SECURITY LOCK ACTIVE';
    securityChip.className = 'security-chip locked';
    keypadDeck.style.display = 'block';
    unlockedChamber.classList.add('hidden');
    doorLamp.className = 'led-lamp led-red';
    doorText.textContent = 'LOCKED';
  }
}

function handleInputKey(key) {
  if (state.unlocked) return;

  const vfd = document.getElementById('vfdReadout');
  vfd.className = 'vfd-text';

  if (key === 'CLR') {
    playControlClick();
    state.slots = ['', '', '', '', '', ''];
    state.activeSlot = 0;
    vfd.textContent = 'BUFFER PURGED // AWAITING 6-DIGIT SEQUENCE...';
    appendCrtLog('CLR', 'SEQUENCE MEMORY BUFFER CLEARED.');
    renderConsole();
    return;
  }

  if (key === 'DEL') {
    playControlClick();
    if (state.slots[state.activeSlot] !== '') {
      state.slots[state.activeSlot] = '';
    } else if (state.activeSlot > 0) {
      state.activeSlot--;
      state.slots[state.activeSlot] = '';
    }
    vfd.textContent = `CHANNEL 0${state.activeSlot + 1} CLEARED`;
    renderConsole();
    return;
  }

  if (/^\d$/.test(key)) {
    playMechKeySound(key);
    state.slots[state.activeSlot] = key;

    const filledCount = state.slots.filter((s) => s !== '').length;
    vfd.textContent = `CH-0${state.activeSlot + 1} SET TO [${key}] // (${filledCount}/6 ENTERED)`;

    if (state.activeSlot < 5) {
      state.activeSlot++;
    }
    renderConsole();
  }
}

function verifyOverrideSequence() {
  if (state.unlocked) return;

  const vfd = document.getElementById('vfdReadout');
  const lockModule = document.getElementById('lockModule');

  if (state.slots.some((s) => s === '')) {
    playAlarmBuzzer();
    vfd.textContent = 'ERR // INCOMPLETE SEQUENCE: ALL 6 CHANNELS REQUIRED';
    vfd.className = 'vfd-text vfd-error';
    appendCrtLog('ERR', 'OVERRIDE REJECTED — INCOMPLETE 6-DIGIT INPUT.');
    triggerConsoleShake(lockModule);
    return;
  }

  const isCorrect = state.slots.every((digit, idx) => digit === TARGET_SEQUENCE[idx]);

  if (isCorrect) {
    playAirlockUnlockSound();
    state.unlocked = true;
    vfd.textContent = 'SEQUENCE 5-7-8-5-6-5 VERIFIED // BLAST DOOR UNLOCKED';
    vfd.className = 'vfd-text vfd-success';
    appendCrtLog('AUTH', 'OVERRIDE CODE 578565 VERIFIED. AIRLOCK UNSEALED!', true);
    renderConsole();
  } else {
    playAlarmBuzzer();
    const entered = state.slots.join('-');
    vfd.textContent = `ACCESS DENIED // SEQUENCE [${entered}] INVALID`;
    vfd.className = 'vfd-text vfd-error';
    appendCrtLog('ALRM', `INVALID CODE [${entered}] — SECURITY LOCKOUT.`);
    triggerConsoleShake(lockModule);

    setTimeout(() => {
      state.slots = ['', '', '', '', '', ''];
      state.activeSlot = 0;
      renderConsole();
    }, 950);
  }
}

function resetAirlockSystem() {
  playControlClick();
  state.unlocked = false;
  state.slots = ['', '', '', '', '', ''];
  state.activeSlot = 0;

  const vfd = document.getElementById('vfdReadout');
  vfd.textContent = 'AWAITING 6-DIGIT SYMBOL OVERRIDE SEQUENCE...';
  vfd.className = 'vfd-text';

  const logContainer = document.getElementById('crtLog');
  logContainer.innerHTML = `
    <p class="log-line"><span class="log-prefix">[SYS]</span> AIRLOCK BLAST DOOR SEALED.</p>
    <p class="log-line"><span class="log-prefix">[DIR]</span> FIND THE <strong>6 EQUATIONS</strong> SCATTERED IN THE ROOM.</p>
    <p class="log-line"><span class="log-prefix">[DIR]</span> SOLVE THE VALUE OF EACH HAZARD SYMBOL.</p>
    <p class="log-line highlight"><span class="log-prefix">[REQ]</span> INPUT THE 6-SYMBOL SEQUENCE TO UNLOCK DOOR.</p>
  `;

  renderConsole();
}

function triggerConsoleShake(el) {
  el.classList.remove('alarm-flash');
  void el.offsetWidth;
  el.classList.add('alarm-flash');
}

// ============================================================================
// INITIALIZE EVENT LISTENERS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Sequence Slot Click Selection
  document.querySelectorAll('#sequenceGrid .seq-cell').forEach((cell) => {
    cell.addEventListener('click', () => {
      if (state.unlocked) return;
      playControlClick();
      state.activeSlot = parseInt(cell.dataset.slot, 10);
      renderConsole();
    });
  });

  // Mechanical Keypad Clicks
  document.querySelectorAll('#mechKeypad .mech-key').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleInputKey(btn.dataset.key);
    });
  });

  // Engage Override Actuator
  document.getElementById('engageOverrideBtn').addEventListener('click', verifyOverrideSequence);

  // Relock / Reset Button for next team
  document.getElementById('relockSystemBtn').addEventListener('click', resetAirlockSystem);

  // Reset Scratchpad Log
  document.getElementById('clearNotesBtn').addEventListener('click', () => {
    playControlClick();
    document.querySelectorAll('.sym-note-input').forEach((inp) => (inp.value = ''));
    appendCrtLog('LOG', 'FIELD SYMBOL NOTES CLEARED.');
  });

  // Audio Rocker Switch
  const sfxBtn = document.getElementById('sfxSwitchBtn');
  const sfxLabel = document.getElementById('sfxSwitchLabel');
  sfxBtn.addEventListener('click', () => {
    state.sfxEnabled = !state.sfxEnabled;
    sfxBtn.classList.toggle('active', state.sfxEnabled);
    sfxLabel.textContent = state.sfxEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
    if (state.sfxEnabled) playControlClick();
  });

  // Fullscreen Rocker Switch
  const fsBtn = document.getElementById('fullscreenSwitchBtn');
  fsBtn.addEventListener('click', () => {
    playControlClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      fsBtn.classList.add('active');
    } else {
      document.exitFullscreen().catch(() => {});
      fsBtn.classList.remove('active');
    }
  });

  // Physical Keyboard Support
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (!state.unlocked) {
      if (e.key >= '0' && e.key <= '9') {
        animateKeycapPress(e.key);
        handleInputKey(e.key);
      } else if (e.key === 'Backspace') {
        animateKeycapPress('DEL');
        handleInputKey('DEL');
      } else if (e.key === 'Escape') {
        animateKeycapPress('CLR');
        handleInputKey('CLR');
      } else if (e.key === 'Enter') {
        verifyOverrideSequence();
      } else if (e.key === 'ArrowLeft' && state.activeSlot > 0) {
        playControlClick();
        state.activeSlot--;
        renderConsole();
      } else if (e.key === 'ArrowRight' && state.activeSlot < 5) {
        playControlClick();
        state.activeSlot++;
        renderConsole();
      }
    }
  });

  renderConsole();
});

function animateKeycapPress(keyVal) {
  const btn = document.querySelector(`#mechKeypad .mech-key[data-key="${keyVal}"]`);
  if (!btn) return;
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}
