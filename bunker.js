// ============================================================================
// G11-SCB // BUNKER CONTROL TERMINAL MK-IV (MULTI-DEVICE / SINGLE-SCREEN CLIENT)
// ============================================================================

const DEVICE_STATION_STORAGE_KEY = 'g11scb_assigned_device_station_v3';

const DEFAULT_CIRCUIT_MATERIALS = [
  { id: 'wood', name: 'DRY WOODEN STICK', icon: '🪵', isConductor: false, resistance: '∞ Ω', reason: 'Wood is an electrical insulator — electrons cannot flow through it.' },
  { id: 'copper', name: 'COPPER WIRE / COIN', icon: '🪙', isConductor: true, resistance: '0.02 Ω', reason: 'Copper is an excellent metallic conductor! Current flows to light the bulb.' },
  { id: 'rubber', name: 'RUBBER ERASER STRIP', icon: '🛞', isConductor: false, resistance: '∞ Ω', reason: 'Rubber is a high-resistance insulator used to block electricity.' },
  { id: 'nail', name: 'IRON / STEEL NAIL', icon: '🔩', isConductor: true, resistance: '0.09 Ω', reason: 'Iron/Steel is a conductive metal that bridges the broken wire gap!' },
  { id: 'plastic', name: 'PLASTIC RULER', icon: '📏', isConductor: false, resistance: '∞ Ω', reason: 'Plastic is a polymer insulator — circuit remains open.' },
  { id: 'foil', name: 'ALUMINUM FOIL STRIP', icon: '✨', isConductor: true, resistance: '0.04 Ω', reason: 'Aluminum is a lightweight metal conductor that completes the circuit!' },
  { id: 'glass', name: 'GLASS TEST ROD', icon: '🧪', isConductor: false, resistance: '∞ Ω', reason: 'Glass is a dielectric insulator — zero current flow.' },
  { id: 'key', name: 'BRASS / METAL KEY', icon: '🔑', isConductor: true, resistance: '0.06 Ω', reason: 'Brass/Metal alloy conducts electricity and ignites the emergency bulb!' }
];

// Fallback Backend Data if offline
let backendData = {
  station1Symbols: {
    radiation: { id: 'radiation', glyph: '☢️', name: 'RADIATION', value: 5 },
    gear: { id: 'gear', glyph: '⚙️', name: 'MECHANICAL GEAR', value: 7 },
    triangle: { id: 'triangle', glyph: '🔺', name: 'DELTA HAZARD', value: 8 },
    biohazard: { id: 'biohazard', glyph: '☣️', name: 'BIOHAZARD', value: 5 },
    snowflake: { id: 'snowflake', glyph: '❄️', name: 'CRYO-FROST', value: 6 }
  },
  station1SequenceOrder: ['radiation', 'gear', 'triangle', 'biohazard', 'snowflake', 'radiation'],
  stations: {
    1: {
      id: 1,
      type: 'symbol-sequence',
      serial: 'UNIT: G11-SCB // SEC-01 // MK-IV',
      title: 'STATION 01: AIRLOCK ALPHA BLAST DOOR',
      code: '578565',
      sequenceSlots: [
        { slot: 1, glyph: '☢️', value: '5' },
        { slot: 2, glyph: '⚙️', value: '7' },
        { slot: 3, glyph: '🔺', value: '8' },
        { slot: 4, glyph: '☣️', value: '5' },
        { slot: 5, glyph: '❄️', value: '6' },
        { slot: 6, glyph: '☢️', value: '5' }
      ],
      crtLines: [
        '[SYS] AIRLOCK ALPHA BLAST DOOR SEALED.',
        '[DIR] FIND THE 6 EQUATIONS SCATTERED IN THE ROOM.',
        '[DIR] SOLVE THE VALUE OF EACH HAZARD SYMBOL.',
        '[REQ] INPUT THE 6-SYMBOL SEQUENCE TO UNLOCK DOOR.'
      ],
      showScratchpad: true,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 01 COMPLETE — PROCEED IMMEDIATELY TO STATION 02',
      equations: [
        { id: 1, title: 'STATION 01 // CLUE CARD #01', formula: '☢️ + ☢️ = 10', solutionNote: '☢️ = 5', hidingSuggestion: 'Hide near entrance airlock or under main briefing table.' },
        { id: 2, title: 'STATION 01 // CLUE CARD #02', formula: '☢️ + ⚙️ = 12', solutionNote: '⚙️ = 7', hidingSuggestion: 'Hide inside generator/fuse box prop or taped behind a tool.' },
        { id: 3, title: 'STATION 01 // CLUE CARD #03', formula: '⚙️ + 🔺 = 15', solutionNote: '🔺 = 8', hidingSuggestion: 'Hide near warning wall poster or emergency supply crate.' },
        { id: 4, title: 'STATION 01 // CLUE CARD #04', formula: '🔺 + ☣️ = 13', solutionNote: '☣️ = 5', hidingSuggestion: 'Hide near decontamination / medical kit prop.' },
        { id: 5, title: 'STATION 01 // CLUE CARD #05', formula: '☣️ + ❄️ = 11', solutionNote: '❄️ = 6', hidingSuggestion: 'Hide near air vent / cooling unit area.' },
        { id: 6, title: 'STATION 01 // CLUE CARD #06', formula: '❄️ + ❄️ = 12', solutionNote: '❄️ = 6', hidingSuggestion: 'Hide inside locker or under keyboard.' }
      ],
      materials: [
        { item: '6 Printed Symbol Equation Clue Cards', detail: 'Print from the Clues Tab and hide around Station 01 area.', category: 'PRINTABLE PROPS' },
        { item: 'Device #1 (Laptop/Tablet) locked to Station 01', detail: 'Open /#station-1 in Fullscreen mode with audio at 80%.', category: 'HARDWARE' },
        { item: 'Scratch Paper & Pens (or Built-in Terminal Log)', detail: 'For players to calculate symbol values from the 6 equations.', category: 'PLAYER GEAR' }
      ],
      stats: { attempts: 0, solves: 0 }
    },
    2: {
      id: 2,
      type: 'code-lock',
      serial: 'UNIT: G11-SCB // SEC-02 // MK-IV',
      title: 'STATION 02: REACTOR CORE OVERRIDE',
      code: '2026',
      sequenceSlots: [
        { slot: 1, glyph: '⚡', value: '2' },
        { slot: 2, glyph: '🌡️', value: '0' },
        { slot: 3, glyph: '🔋', value: '2' },
        { slot: 4, glyph: '⚡', value: '6' }
      ],
      crtLines: [
        '[SYS] SECTOR BETA REACTOR CORE CRITICAL.',
        '[DIR] LOCATE THE REACTOR STABILIZATION CLUES AT STATION 02.',
        '[DIR] DETERMINE THE OVERRIDE PASSCODE.',
        '[REQ] ENTER THE PASSCODE TO STABILIZE CORE.'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 02 COMPLETE — PROCEED IMMEDIATELY TO STATION 03',
      clues: [
        { title: 'STATION 02 CLUE #1', formula: 'CORE PASSCODE: 2026', note: 'Customize this clue in Backend Settings once Challenge 2 is finalized.' }
      ],
      materials: [
        { item: 'Device #2 (Laptop/Tablet) locked to Station 02', detail: 'Open /#station-2 in Fullscreen mode at Station 02.', category: 'HARDWARE' },
        { item: 'Station 02 Physical Clues / Props', detail: 'Customizable in the Backend Settings tab as soon as Challenge 2 is ready.', category: 'PROPS' }
      ],
      stats: { attempts: 0, solves: 0 }
    },
    3: {
      id: 3,
      type: 'circuit-lab',
      serial: 'UNIT: G11-SCB // SEC-03 // CIRCUIT-MK-IV',
      title: 'STATION 03: EMERGENCY CIRCUIT & CONDUCTOR LAB',
      code: 'CONDUCTOR',
      sequenceSlots: [
        { slot: 1, glyph: '🔋', value: '12V' },
        { slot: 2, glyph: '⚡', value: 'WIRE' },
        { slot: 3, glyph: '🪙', value: 'METAL' },
        { slot: 4, glyph: '💡', value: 'LIT' }
      ],
      crtLines: [
        '[SYS] EMERGENCY CORRIDOR LIGHT BULB OFFLINE — WIRE SEVERED.',
        '[DIR] STEP 1: ASSEMBLE THE SIMPLE CIRCUIT (BATTERY + WIRES + BULB).',
        '[DIR] STEP 2: SELECT A CONDUCTIVE MATERIAL TO REPLACE THE BROKEN WIRE.',
        '[REQ] STEP 3: ENGAGE BREAKER TO LIGHT UP THE BULB & REVEAL THE DOOR!'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED // CIRCUIT ENERGIZED',
      victorySubtitle: 'EMERGENCY BULB LIT — HIDDEN DOOR UNLOCKED! PROCEED TO STATION 04',
      circuitMaterials: DEFAULT_CIRCUIT_MATERIALS,
      clues: [
        {
          title: 'STATION 03 // FIELD MANUAL CLUE #1',
          formula: '🔋 + ➖ + 💡 + [METAL] = 💡✨',
          note: 'To complete a simple circuit, connect a Power Source (Battery), Conductive Path (Wires), and Load (Light Bulb) in a closed loop.'
        },
        {
          title: 'STATION 03 // FIELD MANUAL CLUE #2',
          formula: 'CONDUCTORS: 🪙 🔩 ✨ 🔑',
          note: 'Metals (Copper, Iron, Aluminum, Brass) have free electrons that allow electrical current to replace a broken wire.'
        },
        {
          title: 'STATION 03 // FIELD MANUAL CLUE #3',
          formula: 'INSULATORS: 🪵 🛞 📏 🧪',
          note: 'Wood, Rubber, Plastic, and Glass block electrical current and will NOT light the bulb.'
        }
      ],
      materials: [
        { item: 'Device #3 (Laptop/Tablet) locked to Station 03', detail: 'Open /#station-3 in Fullscreen mode to run the Interactive Circuit & Material Lab.', category: 'HARDWARE' },
        { item: '3 Printable Circuit & Conductor Clue Cards', detail: 'Print from the Backend Clues Tab and hide around Station 03.', category: 'PRINTABLE PROPS' },
        { item: 'Optional Real-Life Demo Props (Battery, Bulb, Alligator Clips, Test Objects)', detail: 'Optional physical props next to the tablet: Copper coin, iron nail, aluminum foil, wooden stick, rubber eraser, plastic ruler.', category: 'SCIENCE PROPS' }
      ],
      stats: { attempts: 0, solves: 0 }
    },
    4: {
      id: 4,
      type: 'code-lock',
      serial: 'UNIT: G11-SCB // SEC-04 // MK-IV',
      title: 'STATION 04: CRYO-CONTAINMENT TERMINAL',
      code: '4409',
      sequenceSlots: [
        { slot: 1, glyph: '❄️', value: '4' },
        { slot: 2, glyph: '🧪', value: '4' },
        { slot: 3, glyph: '☣️', value: '0' },
        { slot: 4, glyph: '❄️', value: '9' }
      ],
      crtLines: [
        '[SYS] SECTOR DELTA CRYO-CHAMBER SEAL ENGAGED.',
        '[DIR] INSPECT CONTAINMENT LOGS AT STATION 04.',
        '[DIR] IDENTIFY THERMAL OVERRIDE SEQUENCE.',
        '[REQ] ENTER OVERRIDE CODE TO UNLOCK CHAMBER.'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 04 COMPLETE — PROCEED IMMEDIATELY TO STATION 05',
      clues: [
        { title: 'STATION 04 CLUE #1', formula: 'CRYO CODE: 4409', note: 'Customize this clue in Backend Settings once Challenge 4 is finalized.' }
      ],
      materials: [
        { item: 'Device #4 (Laptop/Tablet) locked to Station 04', detail: 'Open /#station-4 in Fullscreen mode at Station 04.', category: 'HARDWARE' },
        { item: 'Station 04 Physical Clues / Props', detail: 'Customizable in the Backend Settings tab as soon as Challenge 4 is ready.', category: 'PROPS' }
      ],
      stats: { attempts: 0, solves: 0 }
    },
    5: {
      id: 5,
      type: 'code-lock',
      serial: 'UNIT: G11-SCB // SEC-05 // MK-IV',
      title: 'STATION 05: MASTER EVACUATION BLAST DOOR',
      code: '9999',
      sequenceSlots: [
        { slot: 1, glyph: '🚨', value: '9' },
        { slot: 2, glyph: '🔓', value: '9' },
        { slot: 3, glyph: '☢️', value: '9' },
        { slot: 4, glyph: '🚨', value: '9' }
      ],
      crtLines: [
        '[SYS] FINAL SURFACE EVACUATION BLAST DOOR.',
        '[DIR] COMBINE FINAL BUNKER CLEARANCE DATA AT STATION 05.',
        '[DIR] AUTHORIZE MASTER EVACUATION SEQUENCE.',
        '[REQ] INPUT MASTER CODE TO ESCAPE THE BUNKER!'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED // BUNKER ESCAPED!',
      victorySubtitle: 'ALL 5 STATIONS CLEARED — SURFACE BLAST DOORS OPEN!',
      clues: [
        { title: 'STATION 05 CLUE #1', formula: 'MASTER EXIT CODE: 9999', note: 'Customize this clue in Backend Settings once Challenge 5 is finalized.' }
      ],
      materials: [
        { item: 'Device #5 (Laptop/Tablet) locked to Station 05', detail: 'Open /#station-5 in Fullscreen mode at Final Exit Door.', category: 'HARDWARE' },
        { item: 'Station 05 Physical Clues / Props', detail: 'Customizable in the Backend Settings tab as soon as Challenge 5 is ready.', category: 'PROPS' }
      ],
      stats: { attempts: 0, solves: 0 }
    }
  }
};

let state = {
  stationId: 1,
  slots: ['', '', '', '', '', ''],
  activeSlot: 0,
  unlocked: false,
  sfxEnabled: true,
  // Station 03 Simple Circuit Lab State (2 Phases: Phase 1 Scavenger Checklist -> Phase 2 Construct Circuit)
  circuit: {
    phase: 1, // 1 = Scavenger Checklist, 2 = Construct Circuit
    scavengerFound: [false, false, false, false],
    batteryInstalled: false,
    wireInstalled: false,
    bulbInstalled: false,
    selectedMaterialId: null,
    energized: false
  }
};

function getCurrentStationConfig() {
  return backendData.stations[state.stationId] || backendData.stations[1];
}

function detectInitialDeviceStation() {
  const hashMatch = window.location.hash.match(/station-(\d)/i);
  if (hashMatch) {
    const n = parseInt(hashMatch[1], 10);
    if (n >= 1 && n <= 5) return n;
  }
  const params = new URLSearchParams(window.location.search);
  const qSt = parseInt(params.get('station'), 10);
  if (qSt >= 1 && qSt <= 5) return qSt;

  try {
    const saved = parseInt(localStorage.getItem(DEVICE_STATION_STORAGE_KEY), 10);
    if (saved >= 1 && saved <= 5) return saved;
  } catch (e) {}

  return 1;
}

function assignDeviceToStation(stationNum) {
  const stId = Math.min(5, Math.max(1, parseInt(stationNum, 10) || 1));
  state.stationId = stId;
  state.unlocked = false;
  state.activeSlot = 0;
  state.circuit = {
    phase: 1,
    scavengerFound: [false, false, false, false],
    batteryInstalled: false,
    wireInstalled: false,
    bulbInstalled: false,
    selectedMaterialId: null,
    energized: false
  };

  try {
    localStorage.setItem(DEVICE_STATION_STORAGE_KEY, String(stId));
  } catch (e) {}

  history.replaceState(null, '', `#station-${stId}`);

  const stCfg = getCurrentStationConfig();
  const slotCount = (stCfg.sequenceSlots && stCfg.sequenceSlots.length) || 6;
  state.slots = Array(slotCount).fill('');

  applyStationToUI();
  renderConsole();
}

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

function playComponentSnapSound() {
  if (!state.sfxEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  [320, 580].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.055);
    gain.gain.setValueAtTime(0.16, now + idx * 0.055);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.055);
    osc.stop(now + idx * 0.055 + 0.09);
  });
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
      if (data && data.stations) {
        backendData = data;
      }
    }
  } catch (err) {
    console.warn('Using local fallback config:', err);
  }
  const stCfg = getCurrentStationConfig();
  const slotCount = (stCfg.sequenceSlots && stCfg.sequenceSlots.length) || 6;
  if (state.slots.length !== slotCount) {
    state.slots = Array(slotCount).fill('');
    state.activeSlot = 0;
  }
  applyStationToUI();
  renderConsole();
}

function applyStationToUI() {
  const stId = state.stationId;
  const stCfg = getCurrentStationConfig();
  const isCircuitStation = stCfg.type === 'circuit-lab';

  // 1. Hardware Header & CRT Labels
  document.getElementById('stationSerialText').textContent =
    stCfg.serial || `UNIT: G11-SCB // SEC-0${stId} // MK-IV`;
  document.getElementById('stationHeaderTitle').textContent = stCfg.title;
  document.getElementById('activeDeviceBadge').textContent = `STATION 0${stId}`;
  document.getElementById('crtBezelCode').textContent = `CRT-DSP // ST-0${stId}`;
  document.getElementById('crtHeaderLabel').textContent = `SYS.DIAGNOSTIC // G11-SCB // ST-0${stId}`;
  document.getElementById('footerStationId').textContent = `G11-SCB CONTAINMENT DIVISION // STATION 0${stId} TERMINAL`;

  // 2. CRT Initial Log Lines
  const crtLog = document.getElementById('crtLog');
  if (crtLog && Array.isArray(stCfg.crtLines)) {
    crtLog.innerHTML = stCfg.crtLines
      .map((line, i) => {
        const isLast = i === stCfg.crtLines.length - 1;
        return `<p class="log-line ${isLast ? 'highlight' : ''}">${line}</p>`;
      })
      .join('');
  }

  // 3. Toggle between Keypad Mode vs. Circuit Lab Mode
  const scratchMod = document.getElementById('scratchpadModule');
  const circuitTelMod = document.getElementById('circuitTelemetryModule');
  const lockMod = document.getElementById('lockModule');
  const circuitLabMod = document.getElementById('circuitLabModule');

  if (isCircuitStation) {
    scratchMod.style.display = 'none';
    circuitTelMod.classList.remove('hidden');
    lockMod.classList.add('hidden');
    circuitLabMod.classList.remove('hidden');
    renderCircuitMaterialsTray(stCfg.circuitMaterials || DEFAULT_CIRCUIT_MATERIALS);
    renderCircuitLabState();
  } else {
    circuitTelMod.classList.add('hidden');
    circuitLabMod.classList.add('hidden');
    lockMod.classList.remove('hidden');
    scratchMod.style.display = stCfg.showScratchpad ? 'block' : 'none';

    // 4. Sequence Cells Grid (Dynamic slot count)
    const seqGrid = document.getElementById('sequenceGrid');
    const slotsArr = stCfg.sequenceSlots || [];
    document.getElementById('sequenceHousingLabel').textContent =
      `REQUIRED STATION 0${stId} UNLOCK SEQUENCE (${slotsArr.length} DIGITS)`;

    seqGrid.style.gridTemplateColumns = `repeat(${Math.min(slotsArr.length, 6)}, 1fr)`;
    seqGrid.innerHTML = slotsArr
      .map(
        (s, idx) => `
        <div class="seq-cell ${idx === state.activeSlot ? 'active' : ''}" data-slot="${idx}">
          <div class="cell-header">
            <span class="cell-pos">CH-0${idx + 1}</span>
            <span class="cell-led"></span>
          </div>
          <div class="cell-symbol-window">
            <span class="hazard-glyph">${s.glyph}</span>
          </div>
          <div class="cell-seven-seg" id="digit-slot-${idx}">${state.slots[idx] !== '' ? state.slots[idx] : '-'}</div>
        </div>
      `
      )
      .join('');

    seqGrid.querySelectorAll('.seq-cell').forEach((cell) => {
      cell.addEventListener('click', () => {
        if (state.unlocked) return;
        playControlClick();
        state.activeSlot = parseInt(cell.dataset.slot, 10);
        renderConsole();
      });
    });
  }

  // 5. Full-Screen Green Takeover Texts & Verified Badges
  document.getElementById('greenStatusPill').textContent =
    `STATION 0${stId} AUTHORIZATION VERIFIED // OVERRIDE COMPLETE`;
  document.getElementById('greenVictoryTitle').textContent =
    stCfg.victoryTitle || 'ACCESS GRANTED';
  document.getElementById('greenVictorySubtitle').textContent =
    stCfg.victorySubtitle || 'BLAST DOOR UNSEALED';

  const verifiedRow = document.getElementById('greenVerifiedRow');
  const slotsArr = stCfg.sequenceSlots || [];
  if (verifiedRow) {
    verifiedRow.innerHTML = slotsArr
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

  // 6. Update Backend Portal UI for the currently selected station
  populateBackendPortalForStation(stId, stCfg);
}

// ============================================================================
// STATION 03: INTERACTIVE SIMPLE CIRCUIT & CONDUCTOR MATERIAL LAB
// ============================================================================
function renderCircuitMaterialsTray(materialsList) {
  const grid = document.getElementById('circuitMaterialsGrid');
  if (!grid) return;

  grid.innerHTML = materialsList
    .map(
      (mat) => `
      <button class="mat-test-btn ${state.circuit.selectedMaterialId === mat.id ? 'selected-mat' : ''}" data-mat="${mat.id}" type="button">
        <span class="mat-icon">${mat.icon}</span>
        <span class="mat-name">${mat.name}</span>
      </button>
    `
    )
    .join('');

  grid.querySelectorAll('.mat-test-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.unlocked) return;
      playComponentSnapSound();
      state.circuit.selectedMaterialId = btn.dataset.mat;
      state.circuit.energized = false;

      const mats = getCurrentStationConfig().circuitMaterials || DEFAULT_CIRCUIT_MATERIALS;
      const chosen = mats.find((m) => m.id === state.circuit.selectedMaterialId);
      if (chosen) {
        const vfd = document.getElementById('circuitVfdReadout');
        vfd.className = 'vfd-text';
        vfd.textContent = `CLAMPED [${chosen.name}] INTO ALLIGATOR CLIPS — CLICK ENGAGE BREAKER TO TEST!`;
        appendCrtLog('MAT', `CLAMPED TEST MATERIAL: ${chosen.icon} ${chosen.name}`);
      }
      renderCircuitMaterialsTray(mats);
      renderCircuitLabState();
    });
  });
}

function renderCircuitLabState() {
  const c = state.circuit;
  const mats = getCurrentStationConfig().circuitMaterials || DEFAULT_CIRCUIT_MATERIALS;
  const chosenMat = mats.find((m) => m.id === c.selectedMaterialId) || null;

  // Phase 1 vs Phase 2 Visibility
  const phase1Box = document.getElementById('st3Phase1Box');
  const phase2Box = document.getElementById('st3Phase2Box');
  const phaseHeaderCode = document.getElementById('st3PhaseHeaderCode');
  const statusChip = document.getElementById('circuitStatusChip');

  const foundArr = Array.isArray(c.scavengerFound) ? c.scavengerFound : [false, false, false, false];
  const foundCount = foundArr.filter(Boolean).length;
  const allScavFound = foundCount === 4;

  // Render Phase 1 Scavenger Checklist items
  document.querySelectorAll('#scavengerChecklistGrid .scav-item').forEach((itemEl, idx) => {
    const isFound = !!foundArr[idx];
    itemEl.classList.toggle('found', isFound);
    const btn = itemEl.querySelector('.scav-check-btn');
    if (btn) {
      btn.textContent = isFound ? '✅ FOUND IN ROOM' : '⬜ MARK FOUND';
    }
  });

  const progCountEl = document.getElementById('scavProgressCount');
  if (progCountEl) progCountEl.textContent = `${foundCount} / 4 ITEMS FOUND`;
  const progFillEl = document.getElementById('scavProgressFill');
  if (progFillEl) progFillEl.style.width = `${(foundCount / 4) * 100}%`;

  const proceedBtn = document.getElementById('proceedToCircuitBtn');
  const proceedLabel = document.getElementById('proceedToCircuitLabel');
  if (proceedBtn && proceedLabel) {
    proceedBtn.disabled = !allScavFound;
    proceedBtn.classList.toggle('disabled-actuator', !allScavFound);
    proceedLabel.textContent = allScavFound
      ? '🔓 ALL MATERIALS FOUND — CONSTRUCT CIRCUIT NOW →'
      : `🔒 FIND ALL 4 MATERIALS ABOVE TO CONSTRUCT CIRCUIT (${foundCount}/4)`;
  }

  if (c.phase === 1) {
    phase1Box.classList.remove('hidden');
    phase2Box.classList.add('hidden');
    if (phaseHeaderCode) {
      phaseHeaderCode.textContent = 'MOD-03 // PHASE 1: SCAVENGER MATERIALS CHECKLIST';
    }
    if (statusChip) {
      statusChip.textContent = allScavFound
        ? '✅ 4/4 MATERIALS READY'
        : `📦 LOCATE MATERIALS (${foundCount}/4)`;
      statusChip.className = allScavFound ? 'security-chip unlocked' : 'security-chip locked';
    }
  } else {
    phase1Box.classList.add('hidden');
    phase2Box.classList.remove('hidden');
    if (phaseHeaderCode) {
      phaseHeaderCode.textContent = 'MOD-03 // PHASE 2: SIMPLE CIRCUIT CONSTRUCTION';
    }
    if (statusChip && !c.energized) {
      statusChip.textContent = '⚡ CIRCUIT DE-ENERGIZED';
      statusChip.className = 'security-chip locked';
    }
  }

  // 1. Node 1: 12V Battery
  const batBtn = document.getElementById('nodeBatteryBtn');
  const batVis = document.getElementById('nodeBatteryVisual');
  const batTag = document.getElementById('nodeBatteryTag');
  batBtn.classList.toggle('installed', c.batteryInstalled);
  batVis.textContent = c.batteryInstalled ? '🔋 12V BUNKER CELL MOUNTED' : '🔋 CLICK TO MOUNT 12V BATTERY';
  batTag.textContent = c.batteryInstalled ? '12.0 V READY' : 'EMPTY SOCKET';

  // 2. Node 2: Copper Wire Lead
  const wireBtn = document.getElementById('nodeWireBtn');
  const wireVis = document.getElementById('nodeWireVisual');
  const wireTag = document.getElementById('nodeWireTag');
  wireBtn.classList.toggle('installed', c.wireInstalled);
  wireVis.textContent = c.wireInstalled ? '⚡ COPPER BUS WIRE CONNECTED' : '➕ CLICK TO CONNECT COPPER WIRE';
  wireTag.textContent = c.wireInstalled ? 'CONNECTED' : 'DISCONNECTED';

  // 3. Node 3: Emergency Light Bulb
  const bulbBtn = document.getElementById('nodeBulbBtn');
  const bulbVis = document.getElementById('nodeBulbVisual');
  const bulbTag = document.getElementById('nodeBulbTag');
  bulbBtn.classList.toggle('installed', c.bulbInstalled);
  bulbVis.textContent = c.bulbInstalled ? '💡 TUNGSTEN BULB SCREWED IN' : '💡 CLICK TO SCREW IN LIGHT BULB';
  bulbTag.textContent = c.bulbInstalled ? 'MOUNTED' : 'UNINSTALLED';

  // 4. Node 4: Clamped Material Display
  const gapBox = document.getElementById('nodeGapBox');
  const clampedDisp = document.getElementById('clampedMaterialDisplay');
  if (chosenMat) {
    gapBox.classList.add('installed');
    clampedDisp.innerHTML = `${chosenMat.icon} <strong>${chosenMat.name}</strong> CLAMPED IN GAP`;
  } else {
    gapBox.classList.remove('installed');
    clampedDisp.textContent = '⚠️ WIRE SEVERED — SELECT A MATERIAL BELOW';
  }

  // 5. Center Bulb Dome & Traces
  const bulbDome = document.getElementById('bulbDome');
  const beaconCap = document.getElementById('beaconCaption');
  const electronTrace = document.getElementById('electronTrace');
  const baseTrace = document.querySelector('.trace-base');

  const hardwareReady = c.batteryInstalled && c.wireInstalled && c.bulbInstalled;
  if (baseTrace) {
    baseTrace.classList.toggle('assembled-trace', hardwareReady);
  }

  if (c.energized && chosenMat && chosenMat.isConductor) {
    bulbDome.className = 'bulb-dome bulb-lit';
    beaconCap.className = 'beacon-caption lit-caption';
    beaconCap.textContent = '✨ BULB IGNITED — DOOR LOCATED! ✨';
    electronTrace.classList.add('flowing');
  } else {
    electronTrace.classList.remove('flowing');
    beaconCap.className = 'beacon-caption';
    if (c.bulbInstalled) {
      bulbDome.className = 'bulb-dome bulb-ready';
      beaconCap.textContent = 'BULB MOUNTED — AWAITING CLOSED CONDUCTIVE LOOP';
    } else {
      bulbDome.className = 'bulb-dome';
      beaconCap.textContent = 'BULB OFFLINE — DARK CORRIDOR';
    }
  }

  // 6. Left Bay Multimeter & Checklist
  document.getElementById('cstep-battery').classList.toggle('done', c.batteryInstalled);
  document.getElementById('cstep-wire').classList.toggle('done', c.wireInstalled);
  document.getElementById('cstep-bulb').classList.toggle('done', c.bulbInstalled);
  document.getElementById('cstep-material').classList.toggle('done', !!(chosenMat && chosenMat.isConductor && c.energized));

  const mVolt = document.getElementById('meterVoltage');
  const mCurr = document.getElementById('meterCurrent');
  const mRes = document.getElementById('meterResistance');
  const mLum = document.getElementById('meterLumens');

  mVolt.textContent = c.batteryInstalled ? '12.0 V' : '0.0 V';
  mRes.textContent = chosenMat ? chosenMat.resistance : '--- Ω';

  if (c.energized && chosenMat && chosenMat.isConductor) {
    mCurr.textContent = '2.40 A';
    mCurr.classList.add('energized');
    mLum.textContent = '1200 LM';
    mLum.classList.add('energized');
  } else {
    mCurr.textContent = '0.00 A';
    mCurr.classList.remove('energized');
    mLum.textContent = '0 LM';
    mLum.classList.remove('energized');
  }
}

async function testCircuitBreaker() {
  if (state.unlocked) return;

  const c = state.circuit;
  const vfd = document.getElementById('circuitVfdReadout');
  const labMod = document.getElementById('circuitLabModule');
  const mats = getCurrentStationConfig().circuitMaterials || DEFAULT_CIRCUIT_MATERIALS;
  const chosenMat = mats.find((m) => m.id === c.selectedMaterialId) || null;

  // Check if all 3 circuit components are assembled first
  if (!c.batteryInstalled || !c.wireInstalled || !c.bulbInstalled) {
    playAlarmBuzzer();
    const missing = [];
    if (!c.batteryInstalled) missing.push('SLOT 1 (12V BATTERY)');
    if (!c.wireInstalled) missing.push('SLOT 2 (COPPER WIRE)');
    if (!c.bulbInstalled) missing.push('SLOT 3 (LIGHT BULB)');

    vfd.className = 'vfd-text vfd-error';
    vfd.textContent = `⚠️ CIRCUIT INCOMPLETE! CLICK TO INSTALL: ${missing.join(', ')}`;
    appendCrtLog('ERR', `MISSING CIRCUIT PARTS: ${missing.join(', ')}`);
    triggerConsoleShake(labMod);
    return;
  }

  // Check if a material is clamped into Slot 4
  if (!chosenMat) {
    playAlarmBuzzer();
    vfd.className = 'vfd-text vfd-error';
    vfd.textContent = '⚠️ WIRE GAP OPEN! SELECT A MATERIAL BELOW TO REPLACE THE BROKEN WIRE';
    appendCrtLog('ERR', 'NO MATERIAL CLAMPED IN BROKEN WIRE GAP.');
    triggerConsoleShake(labMod);
    return;
  }

  // Test conductivity via Backend API
  try {
    await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stationId: 3,
        circuitComplete: !!chosenMat.isConductor
      })
    });
  } catch (e) {}

  if (chosenMat.isConductor) {
    // Success! Energize circuit, light up the bulb on screen, then trigger Full-Screen Green!
    c.energized = true;
    renderCircuitLabState();
    playAirlockUnlockSound();

    vfd.className = 'vfd-text';
    vfd.style.color = '#34d399';
    vfd.textContent = `✅ ${chosenMat.reason.toUpperCase()} — BULB IGNITED!`;
    appendCrtLog('PASS', `${chosenMat.name} CONDUCTS CURRENT! BULB LIT!`, true);

    const chip = document.getElementById('circuitStatusChip');
    chip.textContent = '💡 CIRCUIT ENERGIZED // BULB LIT';
    chip.className = 'security-chip unlocked';

    // Let players admire the glowing bulb and flowing electrons for 1.6s before full-screen green takeover
    setTimeout(() => {
      state.unlocked = true;
      renderConsole();
    }, 1600);
  } else {
    // Insulator chosen! Explain why the bulb didn't light up
    c.energized = false;
    renderCircuitLabState();
    playAlarmBuzzer();
    vfd.className = 'vfd-text vfd-error';
    vfd.textContent = `❌ BULB DID NOT LIGHT: ${chosenMat.reason.toUpperCase()}`;
    appendCrtLog('FAIL', `${chosenMat.name} IS AN INSULATOR (0.00 A).`);
    triggerConsoleShake(labMod);
  }
}

function resetCircuitLab() {
  playControlClick();
  state.circuit = {
    phase: 1,
    scavengerFound: [false, false, false, false],
    batteryInstalled: false,
    wireInstalled: false,
    bulbInstalled: false,
    selectedMaterialId: null,
    energized: false
  };
  const vfd = document.getElementById('circuitVfdReadout');
  vfd.className = 'vfd-text';
  vfd.style.color = '';
  vfd.textContent = 'STEP 1: CLICK SLOTS 1, 2 & 3 ON THE CIRCUIT BOARD TO ASSEMBLE COMPONENTS...';

  const chip = document.getElementById('circuitStatusChip');
  chip.textContent = '⚡ CIRCUIT DE-ENERGIZED';
  chip.className = 'security-chip locked';

  const mats = getCurrentStationConfig().circuitMaterials || DEFAULT_CIRCUIT_MATERIALS;
  renderCircuitMaterialsTray(mats);
  renderCircuitLabState();
}

// ============================================================================
// BACKEND PORTAL POPULATION
// ============================================================================
function populateBackendPortalForStation(stId, stCfg) {
  document.querySelectorAll('#deviceStationSelector .st-pill').forEach((pill) => {
    pill.classList.toggle('active', parseInt(pill.dataset.st, 10) === stId);
  });

  // Tab 1: Printable Clues
  const cluesGrid = document.getElementById('backendCluesGrid');
  if (stId === 1 && Array.isArray(stCfg.equations)) {
    cluesGrid.innerHTML = stCfg.equations
      .map(
        (eq) => `
        <div class="clue-card-item">
          <span class="clue-card-header">${eq.title}</span>
          <div class="clue-card-formula">${eq.formula}</div>
          <span class="clue-card-note">Crew Key: ${eq.solutionNote}</span>
          <span class="clue-card-hide">📍 ${eq.hidingSuggestion}</span>
        </div>
      `
      )
      .join('');
  } else {
    const cluesList = stCfg.clues || [
      { title: `STATION 0${stId} CLUE CARD`, formula: `CODE: ${stCfg.code}`, note: `Unlock Code: ${stCfg.code}` }
    ];
    cluesGrid.innerHTML = cluesList
      .map(
        (c) => `
        <div class="clue-card-item">
          <span class="clue-card-header">G11-SCB // ${c.title}</span>
          <div class="clue-card-formula">${c.formula}</div>
          <span class="clue-card-note">${c.note || ''}</span>
        </div>
      `
      )
      .join('');
  }

  // Tab 2: Master Answer Key & Materials Checklist
  document.getElementById('akStationLabel').textContent = `STATION 0${stId} SOLUTION / KEY`;
  document.getElementById('backendMasterCode').textContent =
    stCfg.type === 'circuit-lab' ? 'BATTERY + WIRE + BULB + METAL' : stCfg.code;
  document.getElementById('backendDirectLink').textContent = `${window.location.origin}/#station-${stId}`;
  const stats = stCfg.stats || { attempts: 0, solves: 0 };
  document.getElementById('backendStatsSummary').textContent =
    `Attempts: ${stats.attempts || 0} | Solves: ${stats.solves || 0}`;

  const matListEl = document.getElementById('backendMaterialsList');
  const mats = stCfg.materials || [];
  matListEl.innerHTML = mats
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

  // Tab 3: Station Configurator
  const st1Card = document.getElementById('st1SymbolsCard');
  const genCard = document.getElementById('stGenericCodeCard');
  const st3Card = document.getElementById('st3CircuitConfigCard');

  st1Card.classList.add('hidden');
  genCard.classList.add('hidden');
  st3Card.classList.add('hidden');

  if (stId === 1) {
    st1Card.classList.remove('hidden');
    if (backendData.station1Symbols) {
      Object.keys(backendData.station1Symbols).forEach((k) => {
        const inp = document.getElementById(`cfg-sym-${k}`);
        if (inp) inp.value = backendData.station1Symbols[k].value;
      });
    }
  } else if (stId === 3) {
    st3Card.classList.remove('hidden');
  } else {
    genCard.classList.remove('hidden');
    document.getElementById('genCfgHeader').textContent = `STATION 0${stId}: PASSCODE & CLUE CONFIG`;
    document.getElementById('cfgStationTitle').value = stCfg.title || '';
    document.getElementById('cfgStationCode').value = stCfg.code || '';
    const firstClue = (stCfg.clues && stCfg.clues[0] && stCfg.clues[0].formula) || '';
    document.getElementById('cfgStationClue').value = firstClue;
  }

  document.getElementById('cfgVictoryTitle').value = stCfg.victoryTitle || 'ACCESS GRANTED';
  document.getElementById('cfgVictorySubtitle').value = stCfg.victorySubtitle || '';
  document.getElementById('cfgShowScratchpad').checked = !!stCfg.showScratchpad;
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
    const val = state.slots[idx] !== undefined ? state.slots[idx] : '';
    const digitEl = document.getElementById(`digit-slot-${idx}`);
    if (digitEl) digitEl.textContent = val !== '' ? val : '-';

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

  const maxSlots = state.slots.length;
  const vfd = document.getElementById('vfdReadout');
  vfd.className = 'vfd-text';

  if (key === 'CLR') {
    playControlClick();
    state.slots = Array(maxSlots).fill('');
    state.activeSlot = 0;
    vfd.textContent = `BUFFER PURGED // AWAITING ${maxSlots}-DIGIT SEQUENCE...`;
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
    vfd.textContent = `CH-0${state.activeSlot + 1} SET TO [${key}] // (${filledCount}/${maxSlots} ENTERED)`;

    if (state.activeSlot < maxSlots - 1) {
      state.activeSlot++;
    }
    renderConsole();
  }
}

async function verifyOverrideSequence() {
  if (state.unlocked) return;

  const stCfg = getCurrentStationConfig();
  const maxSlots = state.slots.length;
  const vfd = document.getElementById('vfdReadout');
  const lockModule = document.getElementById('lockModule');

  if (state.slots.some((s) => s === '')) {
    playAlarmBuzzer();
    vfd.textContent = `ERR // INCOMPLETE SEQUENCE: ALL ${maxSlots} CHANNELS REQUIRED`;
    vfd.className = 'vfd-text vfd-error';
    appendCrtLog('ERR', `OVERRIDE REJECTED — INCOMPLETE ${maxSlots}-DIGIT INPUT.`);
    triggerConsoleShake(lockModule);
    return;
  }

  const enteredCode = state.slots.join('');
  let isCorrect = enteredCode === String(stCfg.code);

  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stationId: state.stationId,
        slots: state.slots,
        code: enteredCode
      })
    });
    if (res.ok) {
      const result = await res.json();
      isCorrect = !!result.success;
      if (result.stats) stCfg.stats = result.stats;
      populateBackendPortalForStation(state.stationId, stCfg);
    }
  } catch (err) {
    // Fallback to local verification
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
      state.slots = Array(maxSlots).fill('');
      state.activeSlot = 0;
      renderConsole();
    }, 950);
  }
}

function resetAirlockSystem() {
  playControlClick();
  const maxSlots = state.slots.length;
  state.unlocked = false;
  state.slots = Array(maxSlots).fill('');
  state.activeSlot = 0;

  if (getCurrentStationConfig().type === 'circuit-lab') {
    resetCircuitLab();
  } else {
    const vfd = document.getElementById('vfdReadout');
    vfd.textContent = 'AWAITING OVERRIDE SEQUENCE...';
    vfd.className = 'vfd-text';
  }

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
  state.stationId = detectInitialDeviceStation();
  fetchBackendConfig();

  // Listen for URL hash changes (#station-1 .. #station-5)
  window.addEventListener('hashchange', () => {
    const hashMatch = window.location.hash.match(/station-(\d)/i);
    if (hashMatch) {
      const n = parseInt(hashMatch[1], 10);
      if (n >= 1 && n <= 5 && n !== state.stationId) {
        assignDeviceToStation(n);
      }
    }
  });

  // Device Station Selector Pills inside Backend Modal
  document.querySelectorAll('#deviceStationSelector .st-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      playControlClick();
      const targetSt = parseInt(pill.dataset.st, 10);
      assignDeviceToStation(targetSt);
    });
  });

  // Station 03 Phase 1: Scavenger Checklist Buttons
  const scavNames = [
    '12V DC POWER CELL',
    'COPPER WIRE LEADS & CLIPS',
    'EMERGENCY FILAMENT BULB',
    'MYSTERY TEST MATERIALS TRAY'
  ];
  document.querySelectorAll('[data-scav-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.unlocked) return;
      const idx = parseInt(btn.dataset.scavBtn, 10);
      playComponentSnapSound();
      state.circuit.scavengerFound[idx] = !state.circuit.scavengerFound[idx];
      appendCrtLog(
        'SCAV',
        state.circuit.scavengerFound[idx]
          ? `FOUND ITEM #0${idx + 1}: ${scavNames[idx]}`
          : `UNMARKED ITEM #0${idx + 1}`
      );
      renderCircuitLabState();
    });
  });

  document.getElementById('proceedToCircuitBtn').addEventListener('click', () => {
    if (state.circuit.scavengerFound.every(Boolean)) {
      playAirlockUnlockSound();
      state.circuit.phase = 2;
      appendCrtLog('SYS', 'ALL 4 MATERIALS RECOVERED — CIRCUIT WORKBENCH UNLOCKED!', true);
      renderCircuitLabState();
    }
  });

  document.getElementById('backToChecklistBtn').addEventListener('click', () => {
    playControlClick();
    state.circuit.phase = 1;
    renderCircuitLabState();
  });

  // Station 03 Interactive Circuit Nodes (Slots 1, 2, 3)
  document.getElementById('nodeBatteryBtn').addEventListener('click', () => {
    if (state.unlocked) return;
    playComponentSnapSound();
    state.circuit.batteryInstalled = !state.circuit.batteryInstalled;
    state.circuit.energized = false;
    appendCrtLog('CIR', state.circuit.batteryInstalled ? '12V BATTERY CELL INSTALLED.' : '12V BATTERY REMOVED.');
    renderCircuitLabState();
  });

  document.getElementById('nodeWireBtn').addEventListener('click', () => {
    if (state.unlocked) return;
    playComponentSnapSound();
    state.circuit.wireInstalled = !state.circuit.wireInstalled;
    state.circuit.energized = false;
    appendCrtLog('CIR', state.circuit.wireInstalled ? 'COPPER BUS WIRE CONNECTED.' : 'COPPER BUS WIRE DISCONNECTED.');
    renderCircuitLabState();
  });

  document.getElementById('nodeBulbBtn').addEventListener('click', () => {
    if (state.unlocked) return;
    playComponentSnapSound();
    state.circuit.bulbInstalled = !state.circuit.bulbInstalled;
    state.circuit.energized = false;
    appendCrtLog('CIR', state.circuit.bulbInstalled ? 'EMERGENCY FILAMENT BULB MOUNTED.' : 'BULB UNINSTALLED.');
    renderCircuitLabState();
  });

  document.getElementById('testCircuitBreakerBtn').addEventListener('click', testCircuitBreaker);
  document.getElementById('resetCircuitBtn').addEventListener('click', resetCircuitLab);

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

  // Save Station Settings to Backend
  document.getElementById('saveBackendConfigBtn').addEventListener('click', async () => {
    const stId = state.stationId;
    const payload = {
      stationId: stId,
      victoryTitle: document.getElementById('cfgVictoryTitle').value.trim(),
      victorySubtitle: document.getElementById('cfgVictorySubtitle').value.trim(),
      showScratchpad: document.getElementById('cfgShowScratchpad').checked
    };

    if (stId === 1) {
      payload.symbolValues = {
        radiation: parseInt(document.getElementById('cfg-sym-radiation').value, 10),
        gear: parseInt(document.getElementById('cfg-sym-gear').value, 10),
        triangle: parseInt(document.getElementById('cfg-sym-triangle').value, 10),
        biohazard: parseInt(document.getElementById('cfg-sym-biohazard').value, 10),
        snowflake: parseInt(document.getElementById('cfg-sym-snowflake').value, 10)
      };
    } else if (stId !== 3) {
      payload.title = document.getElementById('cfgStationTitle').value.trim();
      payload.code = document.getElementById('cfgStationCode').value.trim();
      payload.clueFormula = document.getElementById('cfgStationClue').value.trim();
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        backendData = await res.json();
        assignDeviceToStation(stId);
        playAirlockUnlockSound();
        const stCfg = getCurrentStationConfig();
        const fb = document.getElementById('backendSaveFeedback');
        fb.textContent = `✅ Station 0${stId} settings saved!`;
        setTimeout(() => (fb.textContent = ''), 4000);
      }
    } catch (err) {
      console.error('Failed to save backend config:', err);
    }
  });

  // Restore Default Settings
  document.getElementById('resetDefaultConfigBtn').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetDefaults: true })
      });
      if (res.ok) {
        backendData = await res.json();
        assignDeviceToStation(state.stationId);
        playControlClick();
        const fb = document.getElementById('backendSaveFeedback');
        fb.textContent = '✅ Restored all 5 stations to factory defaults.';
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

    if (getCurrentStationConfig().type === 'circuit-lab') {
      if (e.key === 'Enter') {
        testCircuitBreaker();
      } else if (e.key === 'Escape') {
        resetCircuitLab();
      }
      return;
    }

    const maxSlots = state.slots.length;
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
    } else if (e.key === 'ArrowRight' && state.activeSlot < maxSlots - 1) {
      playControlClick();
      state.activeSlot++;
      renderConsole();
    }
  });
});

function animateKeycapPress(keyVal) {
  const btn = document.querySelector(`#mechKeypad .mech-key[data-key="${keyVal}"]`);
  if (!btn) return;
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}
