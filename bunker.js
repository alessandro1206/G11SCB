// ============================================================================
// G11-SCB // BLAST DOOR CONTROL TERMINAL MK-IV (FRONTEND + BACKEND CLIENT)
// ============================================================================

let backendConfig = {
  stationName: 'G11-SCB // AIRLOCK ALPHA BLAST DOOR',
  victoryTitle: 'ACCESS GRANTED',
  victorySubtitle: 'BLAST DOOR UNSEALED — PROCEED TO NEXT CHALLENGE STATION',
  showScratchpad: true,
  symbols: {
    radiation: { id: 'radiation', glyph: '☢️', name: 'RADIATION', value: 5 },
    gear: { id: 'gear', glyph: '⚙️', name: 'MECHANICAL GEAR', value: 7 },
    triangle: { id: 'triangle', glyph: '🔺', name: 'DELTA HAZARD', value: 8 },
    biohazard: { id: 'biohazard', glyph: '☣️', name: 'BIOHAZARD', value: 5 },
    snowflake: { id: 'snowflake', glyph: '❄️', name: 'CRYO-FROST', value: 6 }
  },
  sequenceOrder: ['radiation', 'gear', 'triangle', 'biohazard', 'snowflake', 'radiation'],
  sequenceSlots: [
    { slot: 1, id: 'radiation', glyph: '☢️', name: 'RADIATION', value: '5' },
    { slot: 2, id: 'gear', glyph: '⚙️', name: 'MECHANICAL GEAR', value: '7' },
    { slot: 3, id: 'triangle', glyph: '🔺', name: 'DELTA HAZARD', value: '8' },
    { slot: 4, id: 'biohazard', glyph: '☣️', name: 'BIOHAZARD', value: '5' },
    { slot: 5, id: 'snowflake', glyph: '❄️', name: 'CRYO-FROST', value: '6' },
    { slot: 6, id: 'radiation', glyph: '☢️', name: 'RADIATION', value: '5' }
  ],
  targetCode: '578565',
  equations: [
    { id: 1, title: 'CLUE CARD #01', formula: '☢️ + ☢️ = 10', solutionNote: '☢️ = 5', hidingSuggestion: 'Hide near entrance airlock or under main briefing table.' },
    { id: 2, title: 'CLUE CARD #02', formula: '☢️ + ⚙️ = 12', solutionNote: '⚙️ = 7', hidingSuggestion: 'Hide inside generator/fuse box prop or taped behind a tool.' },
    { id: 3, title: 'CLUE CARD #03', formula: '⚙️ + 🔺 = 15', solutionNote: '🔺 = 8', hidingSuggestion: 'Hide near warning wall poster or emergency supply crate.' },
    { id: 4, title: 'CLUE CARD #04', formula: '🔺 + ☣️ = 13', solutionNote: '☣️ = 5', hidingSuggestion: 'Hide near decontamination / medical kit prop.' },
    { id: 5, title: 'CLUE CARD #05', formula: '☣️ + ❄️ = 11', solutionNote: '❄️ = 6', hidingSuggestion: 'Hide near air vent / cooling unit area.' },
    { id: 6, title: 'CLUE CARD #06', formula: '❄️ + ❄️ = 12', solutionNote: '❄️ = 6', hidingSuggestion: 'Hide inside locker or under keyboard.' }
  ],
  materialsChecklist: [
    { id: 'mat-1', item: '6 Printed Symbol Equation Clue Cards', detail: 'Print from the Backend Clues Tab and cut out the 6 cards to hide around the bunker room.', category: 'PRINTABLE PROPS' },
    { id: 'mat-2', item: '1 Laptop / Tablet / Monitor at the Blast Door Station', detail: 'Open this website in Fullscreen mode with speaker volume turned up to 70-80%.', category: 'HARDWARE' },
    { id: 'mat-3', item: 'Tape / Folders / Crates for Hiding Clues', detail: 'Hide the 6 equation cards under tables, inside crates, or behind hazard signs.', category: 'ROOM SETUP' },
    { id: 'mat-4', item: 'Scratch Paper & Pens (or Built-in Terminal Log)', detail: 'Players can calculate symbol values on paper or use the built-in Symbol Value Log on the left bay.', category: 'PLAYER GEAR' }
  ],
  stats: { attempts: 0, solves: 0 }
};

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

function playMechKeySound(digit) {
  if (!state.sfxEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

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

  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const start = now + 0.15 + idx * 0.11;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.18, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.26);
  });
}

// ============================================================================
// BACKEND API SYNCHRONIZATION
// ============================================================================
async function fetchBackendConfig() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      backendConfig = data;
      applyBackendConfigToUI();
    }
  } catch (err) {
    console.warn('Using local fallback config:', err);
    applyBackendConfigToUI();
  }
}

function applyBackendConfigToUI() {
  // 1. Update 6 sequence slot glyphs on main console
  if (Array.isArray(backendConfig.sequenceSlots)) {
    backendConfig.sequenceSlots.forEach((slotObj, idx) => {
      const glyphEl = document.getElementById(`slot-glyph-${idx}`);
      if (glyphEl) glyphEl.textContent = slotObj.glyph;
    });
  }

  // 2. Toggle scratchpad visibility
  const scratchMod = document.getElementById('scratchpadModule');
  if (scratchMod) {
    scratchMod.style.display = backendConfig.showScratchpad ? 'block' : 'none';
  }

  // 3. Update Full-Screen Green Takeover texts & verified cards
  document.getElementById('greenVictoryTitle').textContent =
    backendConfig.victoryTitle || 'ACCESS GRANTED';
  document.getElementById('greenVictorySubtitle').textContent =
    backendConfig.victorySubtitle || 'BLAST DOOR UNSEALED — PROCEED TO NEXT CHALLENGE STATION';

  const verifiedRow = document.getElementById('greenVerifiedRow');
  if (verifiedRow && Array.isArray(backendConfig.sequenceSlots)) {
    verifiedRow.innerHTML = backendConfig.sequenceSlots
      .map(
        (s) => `
        <div class="green-seq-card">
          <span class="green-seq-sym">${s.glyph}</span>
          <span class="green-seq-val">${s.value}</span>
        </div>
      `
      )
      .join('');
  }

  // 4. Populate Backend Portal Tab 1: Printable Equation Clue Cards
  const cluesGrid = document.getElementById('backendCluesGrid');
  if (cluesGrid && Array.isArray(backendConfig.equations)) {
    cluesGrid.innerHTML = backendConfig.equations
      .map(
        (eq) => `
        <div class="clue-card-item">
          <span class="clue-card-header">G11-SCB // ${eq.title}</span>
          <div class="clue-card-formula">${eq.formula}</div>
          <span class="clue-card-note">Crew Key: ${eq.solutionNote}</span>
          <span class="clue-card-hide">📍 ${eq.hidingSuggestion}</span>
        </div>
      `
      )
      .join('');
  }

  // 5. Populate Backend Portal Tab 2: Master Answer Key & Materials Checklist
  const masterCodeEl = document.getElementById('backendMasterCode');
  if (masterCodeEl) masterCodeEl.textContent = backendConfig.targetCode;

  const symSumEl = document.getElementById('backendSymbolSummary');
  if (symSumEl && backendConfig.symbols) {
    const s = backendConfig.symbols;
    symSumEl.textContent = `☢️=${s.radiation.value} | ⚙️=${s.gear.value} | 🔺=${s.triangle.value} | ☣️=${s.biohazard.value} | ❄️=${s.snowflake.value}`;
  }

  const statsEl = document.getElementById('backendStatsSummary');
  if (statsEl && backendConfig.stats) {
    statsEl.textContent = `Attempts: ${backendConfig.stats.attempts || 0} | Solves: ${backendConfig.stats.solves || 0}`;
  }

  const matListEl = document.getElementById('backendMaterialsList');
  if (matListEl && Array.isArray(backendConfig.materialsChecklist)) {
    matListEl.innerHTML = backendConfig.materialsChecklist
      .map(
        (m) => `
        <label class="material-row">
          <input type="checkbox" />
          <div class="mat-info">
            <div class="mat-top">
              <span class="mat-title">${m.item}</span>
              <span class="mat-cat">${m.category}</span>
            </div>
            <p class="mat-detail">${m.detail}</p>
          </div>
        </label>
      `
      )
      .join('');
  }

  // 6. Populate Backend Portal Tab 3: Settings Inputs
  if (backendConfig.symbols) {
    Object.keys(backendConfig.symbols).forEach((k) => {
      const inp = document.getElementById(`cfg-sym-${k}`);
      if (inp) inp.value = backendConfig.symbols[k].value;
    });
  }
  const vTitleInp = document.getElementById('cfgVictoryTitle');
  if (vTitleInp) vTitleInp.value = backendConfig.victoryTitle || 'ACCESS GRANTED';
  const vSubInp = document.getElementById('cfgVictorySubtitle');
  if (vSubInp) vSubInp.value = backendConfig.victorySubtitle || '';
  const showScratchInp = document.getElementById('cfgShowScratchpad');
  if (showScratchInp) showScratchInp.checked = !!backendConfig.showScratchpad;
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
  });

  const fullGreenScreen = document.getElementById('fullGreenScreen');
  const doorLamp = document.getElementById('doorStatusLamp');
  const doorText = document.getElementById('doorStatusText');

  if (state.unlocked) {
    fullGreenScreen.classList.remove('hidden');
    doorLamp.className = 'led-lamp led-green';
    doorText.textContent = 'UNSEALED';
  } else {
    fullGreenScreen.classList.add('hidden');
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

async function verifyOverrideSequence() {
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

  const enteredCode = state.slots.join('');
  let isCorrect = enteredCode === backendConfig.targetCode;

  // Verify with Backend API
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots: state.slots, code: enteredCode })
    });
    if (res.ok) {
      const result = await res.json();
      isCorrect = !!result.success;
      if (result.stats) backendConfig.stats = result.stats;
      applyBackendConfigToUI();
    }
  } catch (err) {
    // Fallback to local check if offline
  }

  if (isCorrect) {
    playAirlockUnlockSound();
    state.unlocked = true;
    appendCrtLog('AUTH', `CODE ${enteredCode} VERIFIED. ACCESS GRANTED!`, true);
    renderConsole();
  } else {
    playAlarmBuzzer();
    const enteredFormatted = state.slots.join('-');
    vfd.textContent = `ACCESS DENIED // SEQUENCE [${enteredFormatted}] INVALID`;
    vfd.className = 'vfd-text vfd-error';
    appendCrtLog('ALRM', `INVALID CODE [${enteredFormatted}] — SECURITY LOCKOUT.`);
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
  fetchBackendConfig();

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

  // Full-Screen Green Reset Button
  document.getElementById('greenResetBtn').addEventListener('click', resetAirlockSystem);

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

  // ==================== BACKEND MODAL CONTROLS ====================
  const backendModal = document.getElementById('backendModal');
  document.getElementById('openBackendBtn').addEventListener('click', () => {
    playControlClick();
    fetchBackendConfig();
    backendModal.classList.remove('hidden');
  });

  document.getElementById('closeBackendBtn').addEventListener('click', () => {
    playControlClick();
    backendModal.classList.add('hidden');
  });

  // Backend Tabs Switching
  document.querySelectorAll('.btab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      playControlClick();
      document.querySelectorAll('.btab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.btab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.dataset.btab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Save Backend Settings
  document.getElementById('saveBackendConfigBtn').addEventListener('click', async () => {
    const symbolValues = {
      radiation: parseInt(document.getElementById('cfg-sym-radiation').value, 10),
      gear: parseInt(document.getElementById('cfg-sym-gear').value, 10),
      triangle: parseInt(document.getElementById('cfg-sym-triangle').value, 10),
      biohazard: parseInt(document.getElementById('cfg-sym-biohazard').value, 10),
      snowflake: parseInt(document.getElementById('cfg-sym-snowflake').value, 10)
    };
    const victoryTitle = document.getElementById('cfgVictoryTitle').value.trim();
    const victorySubtitle = document.getElementById('cfgVictorySubtitle').value.trim();
    const showScratchpad = document.getElementById('cfgShowScratchpad').checked;

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbolValues,
          victoryTitle,
          victorySubtitle,
          showScratchpad
        })
      });
      if (res.ok) {
        backendConfig = await res.json();
        applyBackendConfigToUI();
        playAirlockUnlockSound();
        const fb = document.getElementById('backendSaveFeedback');
        fb.textContent = `✅ Saved! New Master Unlock Code: ${backendConfig.targetCode}`;
        setTimeout(() => (fb.textContent = ''), 4000);
      }
    } catch (err) {
      console.error('Failed to save backend config:', err);
    }
  });

  // Restore Default Settings (578565)
  document.getElementById('resetDefaultConfigBtn').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetDefaults: true })
      });
      if (res.ok) {
        backendConfig = await res.json();
        applyBackendConfigToUI();
        playControlClick();
        const fb = document.getElementById('backendSaveFeedback');
        fb.textContent = '✅ Restored default equations & code (578565).';
        setTimeout(() => (fb.textContent = ''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Operator Quick Override: Force Full-Screen Green Access Granted
  document.getElementById('triggerGreenScreenBtn').addEventListener('click', () => {
    backendModal.classList.add('hidden');
    playAirlockUnlockSound();
    state.unlocked = true;
    renderConsole();
  });

  // Operator Quick Override: Force Re-lock
  document.getElementById('forceRelockBtn').addEventListener('click', () => {
    backendModal.classList.add('hidden');
    resetAirlockSystem();
  });

  // Physical Keyboard Support
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    // Allow Escape to reset when Full-Screen Green Access Granted is active
    if (state.unlocked) {
      if (e.key === 'Escape') {
        resetAirlockSystem();
      }
      return;
    }

    if (!backendModal.classList.contains('hidden')) {
      if (e.key === 'Escape') backendModal.classList.add('hidden');
      return;
    }

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
  });

  // Open backend portal automatically if URL ends with #backend or #admin
  if (['#backend', '#admin'].includes(window.location.hash)) {
    backendModal.classList.remove('hidden');
  }

  renderConsole();
});

function animateKeycapPress(keyVal) {
  const btn = document.querySelector(`#mechKeypad .mech-key[data-key="${keyVal}"]`);
  if (!btn) return;
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}
