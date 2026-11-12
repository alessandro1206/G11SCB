// ============================================================================
// G11 SCB // BUNKER CONTROL TERMINAL - CORE LOGIC
// ============================================================================

const STORAGE_KEY = 'g11scb_bunker_state_v1';

// Station 1 Target Sequence:
// ☢️ = 5, ⚙️ = 7, 🔺 = 8, ☣️ = 5, ❄️ = 6
// Sequence: ☢️ ⚙️ 🔺 ☣️ ❄️ ☢️ -> 5 7 8 5 6 5
const ST1_TARGET_CODE = ['5', '7', '8', '5', '6', '5'];
const ST1_SLOT_SYMBOLS = ['radiation', 'gear', 'triangle', 'biohazard', 'snowflake', 'radiation'];

// Default configuration for Placeholder Stations 2-5
const DEFAULT_GENERIC_STATIONS = {
  2: {
    id: 2,
    tag: 'STATION 02 // SECTOR BETA',
    title: 'SECTOR BETA: REACTOR OVERRIDE',
    desc: 'Placeholder module for Station 02. Enter the Sector Beta override code discovered at Station 02, or use the Crew Configurator below to customize this challenge.',
    code: '2026',
    nextDirective: 'PROCEED IMMEDIATELY TO STATION 03'
  },
  3: {
    id: 3,
    tag: 'STATION 03 // SECTOR GAMMA',
    title: 'SECTOR GAMMA: COMMS DECODER',
    desc: 'Placeholder module for Station 03. Enter the Sector Gamma transmission cipher code, or use the Crew Configurator below to customize this challenge.',
    code: '3115',
    nextDirective: 'PROCEED IMMEDIATELY TO STATION 04'
  },
  4: {
    id: 4,
    tag: 'STATION 04 // SECTOR DELTA',
    title: 'SECTOR DELTA: CRYO CONTAINMENT',
    desc: 'Placeholder module for Station 04. Enter the thermal stabilization code, or use the Crew Configurator below to customize this challenge.',
    code: '4409',
    nextDirective: 'PROCEED IMMEDIATELY TO STATION 05'
  },
  5: {
    id: 5,
    tag: 'STATION 05 // SECTOR OMEGA',
    title: 'SECTOR OMEGA: MAIN BLAST DOOR EXIT',
    desc: 'Final Bunker Override Station. Enter the master evacuation sequence to unseal the surface blast doors and escape the bunker!',
    code: '9999',
    nextDirective: 'BUNKER EVACUATION COMPLETE — YOU ESCAPED!'
  }
};

// Application State
let appState = {
  currentView: 'hub', // 'hub' | 'station-1' | 'station-2' | 'station-3' | 'station-4' | 'station-5'
  sfxEnabled: true,
  kioskLocked: false,
  solvedStations: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  },
  st1Slots: ['', '', '', '', '', ''],
  st1ActiveSlot: 0,
  genericStations: JSON.parse(JSON.stringify(DEFAULT_GENERIC_STATIONS)),
  activeGenericId: 2,
  genericInput: ''
};

// Load saved state from localStorage
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.solvedStations) appState.solvedStations = { ...appState.solvedStations, ...parsed.solvedStations };
      if (parsed.genericStations) appState.genericStations = { ...DEFAULT_GENERIC_STATIONS, ...parsed.genericStations };
      if (typeof parsed.sfxEnabled === 'boolean') appState.sfxEnabled = parsed.sfxEnabled;
    }
  } catch (err) {
    console.warn('Could not load saved bunker state:', err);
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        solvedStations: appState.solvedStations,
        genericStations: appState.genericStations,
        sfxEnabled: appState.sfxEnabled
      })
    );
  } catch (err) {
    console.warn('Could not save bunker state:', err);
  }
}

// ============================================================================
// WEB AUDIO API SOUND SYNTHESIZER (NO EXTERNAL MP3 FILES NEEDED)
// ============================================================================
let audioCtx = null;

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

function playTone(freq = 800, duration = 0.07, type = 'sine', gainVal = 0.12) {
  if (!appState.sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function sfxKeyPress(digit) {
  const baseFreq = 620 + (parseInt(digit, 10) || 0) * 38;
  playTone(baseFreq, 0.065, 'triangle', 0.14);
}

function sfxActionKey() {
  playTone(440, 0.08, 'sawtooth', 0.1);
}

function sfxErrorAlarm() {
  if (!appState.sfxEnabled) return;
  playTone(190, 0.18, 'sawtooth', 0.2);
  setTimeout(() => playTone(150, 0.25, 'sawtooth', 0.22), 190);
}

function sfxAccessGranted() {
  if (!appState.sfxEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.16, 'triangle', 0.18), idx * 110);
  });
}

// ============================================================================
// NAVIGATION & VIEW SWITCHING
// ============================================================================
function switchView(targetView, updateHash = true) {
  appState.currentView = targetView;

  // Update top nav buttons
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === targetView);
  });

  // Hide all view sections
  document.querySelectorAll('.view-section').forEach((sec) => {
    sec.classList.remove('active');
  });

  if (targetView === 'hub') {
    document.getElementById('view-hub').classList.add('active');
    renderHubStatus();
  } else if (targetView === 'station-1') {
    document.getElementById('view-station-1').classList.add('active');
    renderStation1();
  } else if (targetView.startsWith('station-')) {
    const stNum = parseInt(targetView.replace('station-', ''), 10);
    appState.activeGenericId = stNum;
    appState.genericInput = '';
    document.getElementById('view-station-generic').classList.add('active');
    renderGenericStation(stNum);
  }

  if (updateHash) {
    history.replaceState(null, '', `#${targetView}`);
  }
}

function renderHubStatus() {
  for (let i = 1; i <= 5; i++) {
    const solved = !!appState.solvedStations[i];
    const badge = document.getElementById(`hub-status-${i}`);
    const card = document.querySelector(`.station-card[data-station="${i}"]`);
    const navBtn = document.querySelector(`.nav-btn[data-target="station-${i}"]`);

    if (badge) {
      badge.textContent = solved ? '✅ UNLOCKED' : '🔒 LOCKED';
      badge.classList.toggle('unlocked', solved);
    }
    if (card) {
      card.classList.toggle('solved-card', solved);
    }
    if (navBtn) {
      navBtn.classList.toggle('solved', solved);
    }

    // Update customized title/desc on Hub for stations 2-5
    if (i >= 2 && appState.genericStations[i]) {
      const tEl = document.getElementById(`hub-title-${i}`);
      const dEl = document.getElementById(`hub-desc-${i}`);
      if (tEl) tEl.textContent = appState.genericStations[i].title;
      if (dEl) dEl.textContent = appState.genericStations[i].desc;
    }
  }
}

// ============================================================================
// STATION 01: SYMBOL EQUATION SEQUENCE LOCK (5 - 7 - 8 - 5 - 6 - 5)
// ============================================================================
function renderStation1() {
  const isSolved = appState.solvedStations[1];
  const slots = document.querySelectorAll('#st1SequenceRow .seq-slot');

  slots.forEach((slotEl, idx) => {
    const val = appState.st1Slots[idx];
    const digitEl = document.getElementById(`st1-slot-${idx}`);
    digitEl.textContent = val !== '' ? val : '_';

    slotEl.classList.toggle('active', !isSolved && idx === appState.st1ActiveSlot);
    slotEl.classList.toggle('filled', val !== '');
    slotEl.classList.toggle('correct-slot', isSolved);
  });

  const lockBadge = document.getElementById('st1LockBadge');
  const consolePanel = document.getElementById('st1ConsolePanel');
  const keypadWrapper = document.getElementById('st1KeypadWrapper');
  const victoryOverlay = document.getElementById('st1VictoryOverlay');
  const readout = document.getElementById('st1Readout');

  if (isSolved) {
    lockBadge.textContent = '🔓 AIRLOCK UNSEALED';
    lockBadge.className = 'lock-state-badge unlocked';
    consolePanel.classList.add('unlocked-panel');
    keypadWrapper.style.display = 'none';
    victoryOverlay.classList.remove('hidden');
    readout.textContent = 'OVERRIDE SEQUENCE ACCEPTED // ACCESS GRANTED';
    readout.className = 'terminal-readout success';
  } else {
    lockBadge.textContent = '🔒 AIRLOCK SEALED';
    lockBadge.className = 'lock-state-badge locked';
    consolePanel.classList.remove('unlocked-panel');
    keypadWrapper.style.display = 'block';
    victoryOverlay.classList.add('hidden');
  }
}

function handleSt1Key(key) {
  if (appState.solvedStations[1]) return;

  const readout = document.getElementById('st1Readout');
  readout.className = 'terminal-readout';

  if (key === 'CLR') {
    sfxActionKey();
    appState.st1Slots = ['', '', '', '', '', ''];
    appState.st1ActiveSlot = 0;
    readout.textContent = 'SEQUENCE BUFFER CLEARED. AWAITING INPUT...';
    renderStation1();
    return;
  }

  if (key === 'DEL') {
    sfxActionKey();
    if (appState.st1Slots[appState.st1ActiveSlot] !== '') {
      appState.st1Slots[appState.st1ActiveSlot] = '';
    } else if (appState.st1ActiveSlot > 0) {
      appState.st1ActiveSlot--;
      appState.st1Slots[appState.st1ActiveSlot] = '';
    }
    readout.textContent = 'DIGIT REMOVED.';
    renderStation1();
    return;
  }

  // Digit 0-9
  if (/^\d$/.test(key)) {
    sfxKeyPress(key);
    appState.st1Slots[appState.st1ActiveSlot] = key;
    if (appState.st1ActiveSlot < 5) {
      appState.st1ActiveSlot++;
    }
    const enteredCount = appState.st1Slots.filter((x) => x !== '').length;
    readout.textContent = `INPUT BUFFER: ${enteredCount}/6 SYMBOLS DECODED`;
    renderStation1();
  }
}

function verifySt1Sequence() {
  if (appState.solvedStations[1]) return;

  const readout = document.getElementById('st1Readout');
  const consolePanel = document.getElementById('st1ConsolePanel');

  if (appState.st1Slots.some((s) => s === '')) {
    sfxErrorAlarm();
    readout.textContent = '⚠️ INCOMPLETE SEQUENCE: ENTER ALL 6 SYMBOL DIGITS';
    readout.className = 'terminal-readout error';
    triggerShake(consolePanel);
    return;
  }

  const isMatch = appState.st1Slots.every((val, idx) => val === ST1_TARGET_CODE[idx]);

  if (isMatch) {
    sfxAccessGranted();
    appState.solvedStations[1] = true;
    saveState();
    renderStation1();
    renderHubStatus();
  } else {
    sfxErrorAlarm();
    const enteredStr = appState.st1Slots.join(' - ');
    readout.textContent = `❌ ACCESS DENIED: SEQUENCE [${enteredStr}] INVALID`;
    readout.className = 'terminal-readout error';
    triggerShake(consolePanel);
    setTimeout(() => {
      appState.st1Slots = ['', '', '', '', '', ''];
      appState.st1ActiveSlot = 0;
      renderStation1();
    }, 950);
  }
}

function resetStation1() {
  sfxActionKey();
  appState.solvedStations[1] = false;
  appState.st1Slots = ['', '', '', '', '', ''];
  appState.st1ActiveSlot = 0;
  saveState();
  const readout = document.getElementById('st1Readout');
  readout.textContent = 'AWAITING 6-DIGIT SYMBOL OVERRIDE CODE...';
  readout.className = 'terminal-readout';
  renderStation1();
  renderHubStatus();
}

// Transfer values from the optional scratchpad into the 6 door slots
function transferScratchpadToSequence() {
  if (appState.solvedStations[1]) return;
  const map = {};
  document.querySelectorAll('.scratch-input').forEach((inp) => {
    const val = inp.value.trim();
    if (val !== '') {
      map[inp.dataset.sym] = val.slice(-1); // single digit
    }
  });

  let filledAny = false;
  ST1_SLOT_SYMBOLS.forEach((symName, idx) => {
    if (map[symName] !== undefined) {
      appState.st1Slots[idx] = map[symName];
      filledAny = true;
    }
  });

  const readout = document.getElementById('st1Readout');
  if (filledAny) {
    sfxActionKey();
    readout.textContent = 'SCRATCHPAD VALUES TRANSFERRED TO DOOR SEQUENCE.';
    readout.className = 'terminal-readout';
    // Move active cursor to first empty slot or last slot
    const firstEmpty = appState.st1Slots.findIndex((s) => s === '');
    appState.st1ActiveSlot = firstEmpty !== -1 ? firstEmpty : 5;
    renderStation1();
  } else {
    sfxErrorAlarm();
    readout.textContent = 'ENTER SYMBOL VALUES IN THE SCRATCHPAD FIRST.';
    readout.className = 'terminal-readout error';
  }
}

// ============================================================================
// PLACEHOLDER STATIONS 02–05 (CONFIGURABLE TERMINALS)
// ============================================================================
function renderGenericStation(stNum) {
  const cfg = appState.genericStations[stNum];
  if (!cfg) return;

  const isSolved = !!appState.solvedStations[stNum];

  document.getElementById('genStationTag').textContent = cfg.tag;
  document.getElementById('genStationTitle').textContent = cfg.title;
  document.getElementById('genStationDesc').textContent = cfg.desc;
  document.getElementById('genConsoleTag').textContent = `STATION 0${stNum} // OVERRIDE TERMINAL`;

  // Populate Crew Configurator inputs
  document.getElementById('cfgTitleInput').value = cfg.title;
  document.getElementById('cfgDescInput').value = cfg.desc;
  document.getElementById('cfgCodeInput').value = cfg.code;

  // Format code display
  const targetLen = cfg.code.length || 4;
  let displayArr = [];
  for (let i = 0; i < targetLen; i++) {
    displayArr.push(appState.genericInput[i] !== undefined ? appState.genericInput[i] : '_');
  }
  document.getElementById('genCodeDisplay').textContent = displayArr.join(' ');

  const lockBadge = document.getElementById('genLockBadge');
  const consolePanel = document.getElementById('genConsolePanel');
  const keypadWrapper = document.getElementById('genKeypadWrapper');
  const victoryOverlay = document.getElementById('genVictoryOverlay');
  const readout = document.getElementById('genReadout');

  if (isSolved) {
    lockBadge.textContent = '🔓 OVERRIDE COMPLETE';
    lockBadge.className = 'lock-state-badge unlocked';
    consolePanel.classList.add('unlocked-panel');
    keypadWrapper.style.display = 'none';
    victoryOverlay.classList.remove('hidden');
    document.getElementById('genNextDirective').textContent = cfg.nextDirective;
    readout.textContent = 'AUTHORIZATION ACCEPTED // STATION UNLOCKED';
    readout.className = 'terminal-readout success';
  } else {
    lockBadge.textContent = '🔒 SYSTEM LOCKED';
    lockBadge.className = 'lock-state-badge locked';
    consolePanel.classList.remove('unlocked-panel');
    keypadWrapper.style.display = 'block';
    victoryOverlay.classList.add('hidden');
  }
}

function handleGenericKey(key) {
  const stNum = appState.activeGenericId;
  if (appState.solvedStations[stNum]) return;
  const cfg = appState.genericStations[stNum];
  const maxLen = cfg.code.length || 4;
  const readout = document.getElementById('genReadout');
  readout.className = 'terminal-readout';

  if (key === 'CLR') {
    sfxActionKey();
    appState.genericInput = '';
    readout.textContent = 'INPUT CLEARED.';
    renderGenericStation(stNum);
    return;
  }

  if (key === 'DEL') {
    sfxActionKey();
    appState.genericInput = appState.genericInput.slice(0, -1);
    renderGenericStation(stNum);
    return;
  }

  if (/^\d$/.test(key) && appState.genericInput.length < maxLen) {
    sfxKeyPress(key);
    appState.genericInput += key;
    renderGenericStation(stNum);
  }
}

function verifyGenericCode() {
  const stNum = appState.activeGenericId;
  if (appState.solvedStations[stNum]) return;
  const cfg = appState.genericStations[stNum];
  const readout = document.getElementById('genReadout');
  const consolePanel = document.getElementById('genConsolePanel');

  if (appState.genericInput === cfg.code) {
    sfxAccessGranted();
    appState.solvedStations[stNum] = true;
    saveState();
    renderGenericStation(stNum);
    renderHubStatus();
  } else {
    sfxErrorAlarm();
    readout.textContent = '❌ INVALID OVERRIDE CODE — ACCESS DENIED';
    readout.className = 'terminal-readout error';
    triggerShake(consolePanel);
    setTimeout(() => {
      appState.genericInput = '';
      renderGenericStation(stNum);
    }, 800);
  }
}

function triggerShake(el) {
  el.classList.remove('error-shake');
  void el.offsetWidth; // force reflow
  el.classList.add('error-shake');
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Top Navigation Buttons
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sfxActionKey();
      switchView(btn.dataset.target);
    });
  });

  // Hub Launch Buttons & Next Station Buttons
  document.querySelectorAll('[data-launch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sfxActionKey();
      switchView(btn.dataset.launch);
    });
  });

  // Station 1 Slot Selection
  document.querySelectorAll('#st1SequenceRow .seq-slot').forEach((slotEl) => {
    slotEl.addEventListener('click', () => {
      if (appState.solvedStations[1]) return;
      sfxActionKey();
      appState.st1ActiveSlot = parseInt(slotEl.dataset.slot, 10);
      renderStation1();
    });
  });

  // Station 1 Keypad Buttons
  document.querySelectorAll('#st1Keypad .key-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleSt1Key(btn.dataset.key);
    });
  });

  document.getElementById('st1SubmitBtn').addEventListener('click', verifySt1Sequence);
  document.getElementById('st1ResetBtn').addEventListener('click', resetStation1);

  // Scratchpad controls
  document.getElementById('applyScratchpadBtn').addEventListener('click', transferScratchpadToSequence);
  document.getElementById('clearScratchpadBtn').addEventListener('click', () => {
    sfxActionKey();
    document.querySelectorAll('.scratch-input').forEach((inp) => (inp.value = ''));
  });

  // Generic Station Keypad Buttons
  document.querySelectorAll('#genKeypad .key-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleGenericKey(btn.dataset.gkey);
    });
  });

  document.getElementById('genSubmitBtn').addEventListener('click', verifyGenericCode);
  document.getElementById('genResetBtn').addEventListener('click', () => {
    const stNum = appState.activeGenericId;
    sfxActionKey();
    appState.solvedStations[stNum] = false;
    appState.genericInput = '';
    saveState();
    renderGenericStation(stNum);
    renderHubStatus();
  });

  // Save Generic Station Config
  document.getElementById('saveStationConfigBtn').addEventListener('click', () => {
    const stNum = appState.activeGenericId;
    const newTitle = document.getElementById('cfgTitleInput').value.trim();
    const newDesc = document.getElementById('cfgDescInput').value.trim();
    const newCode = document.getElementById('cfgCodeInput').value.trim().replace(/\s+/g, '');

    if (newTitle) appState.genericStations[stNum].title = newTitle;
    if (newDesc) appState.genericStations[stNum].desc = newDesc;
    if (newCode) appState.genericStations[stNum].code = newCode;

    appState.genericInput = '';
    saveState();
    sfxAccessGranted();
    renderGenericStation(stNum);
    renderHubStatus();
    const readout = document.getElementById('genReadout');
    readout.textContent = '✅ STATION CONFIGURATION SAVED LOCALLY';
    readout.className = 'terminal-readout success';
  });

  // Physical Keyboard Support for Station 1 & Generic Stations
  window.addEventListener('keydown', (e) => {
    // Ignore keyboard shortcuts if typing inside an input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (appState.currentView === 'station-1' && !appState.solvedStations[1]) {
      if (e.key >= '0' && e.key <= '9') {
        handleSt1Key(e.key);
      } else if (e.key === 'Backspace') {
        handleSt1Key('DEL');
      } else if (e.key === 'Escape') {
        handleSt1Key('CLR');
      } else if (e.key === 'Enter') {
        verifySt1Sequence();
      } else if (e.key === 'ArrowLeft' && appState.st1ActiveSlot > 0) {
        appState.st1ActiveSlot--;
        renderStation1();
      } else if (e.key === 'ArrowRight' && appState.st1ActiveSlot < 5) {
        appState.st1ActiveSlot++;
        renderStation1();
      }
    } else if (appState.currentView.startsWith('station-') && appState.currentView !== 'station-1') {
      const stNum = appState.activeGenericId;
      if (!appState.solvedStations[stNum]) {
        if (e.key >= '0' && e.key <= '9') {
          handleGenericKey(e.key);
        } else if (e.key === 'Backspace') {
          handleGenericKey('DEL');
        } else if (e.key === 'Escape') {
          handleGenericKey('CLR');
        } else if (e.key === 'Enter') {
          verifyGenericCode();
        }
      }
    }
  });

  // Utility Buttons: SFX Toggle, Kiosk Station Lock, Fullscreen
  const sfxBtn = document.getElementById('sfxToggleBtn');
  const updateSfxLabel = () => {
    sfxBtn.textContent = appState.sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  };
  updateSfxLabel();
  sfxBtn.addEventListener('click', () => {
    appState.sfxEnabled = !appState.sfxEnabled;
    updateSfxLabel();
    saveState();
    if (appState.sfxEnabled) sfxActionKey();
  });

  const kioskBtn = document.getElementById('kioskLockBtn');
  const stationNav = document.getElementById('stationNav');
  kioskBtn.addEventListener('click', () => {
    appState.kioskLocked = !appState.kioskLocked;
    stationNav.classList.toggle('kiosk-hidden', appState.kioskLocked);
    kioskBtn.classList.toggle('locked-kiosk', appState.kioskLocked);
    kioskBtn.textContent = appState.kioskLocked ? '🔒 STATION LOCKED' : '🔓 STATION UNLOCKED';
    sfxActionKey();
  });

  document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Reset All Stations Button
  document.getElementById('resetAllBtn').addEventListener('click', () => {
    sfxActionKey();
    appState.solvedStations = { 1: false, 2: false, 3: false, 4: false, 5: false };
    appState.st1Slots = ['', '', '', '', '', ''];
    appState.st1ActiveSlot = 0;
    appState.genericInput = '';
    saveState();
    renderHubStatus();
  });

  // Clues Reference Modal
  const cluesModal = document.getElementById('cluesModal');
  document.getElementById('openCluesModalBtn').addEventListener('click', () => {
    sfxActionKey();
    cluesModal.classList.remove('hidden');
  });
  document.getElementById('closeCluesModalBtn').addEventListener('click', () => {
    cluesModal.classList.add('hidden');
  });
  document.getElementById('closeCluesModalBtn2').addEventListener('click', () => {
    cluesModal.classList.add('hidden');
  });

  // Check initial URL hash (e.g., #station-1)
  const initialHash = window.location.hash.replace('#', '');
  if (['hub', 'station-1', 'station-2', 'station-3', 'station-4', 'station-5'].includes(initialHash)) {
    switchView(initialHash, false);
  } else {
    switchView('hub', false);
  }
});
