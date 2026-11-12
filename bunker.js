// ============================================================================
// G11-SCB // BUNKER CONTROL TERMINAL MK-IV
// Public Frontend + Authenticated Operator Backend Client
// ============================================================================

const DEVICE_STATION_STORAGE_KEY = 'g11scb_assigned_device_station_v4';

const PUBLIC_CIRCUIT_MATERIALS = [
  { id: 'wood', name: 'DRY WOODEN STICK', icon: '🪵' },
  { id: 'copper', name: 'COPPER WIRE / COIN', icon: '🪙' },
  { id: 'rubber', name: 'RUBBER ERASER STRIP', icon: '🛞' },
  { id: 'nail', name: 'IRON / STEEL NAIL', icon: '🔩' },
  { id: 'plastic', name: 'PLASTIC RULER', icon: '📏' },
  { id: 'foil', name: 'ALUMINUM FOIL STRIP', icon: '✨' },
  { id: 'glass', name: 'GLASS TEST ROD', icon: '🧪' },
  { id: 'key', name: 'BRASS / METAL KEY', icon: '🔑' }
];

// Public-only fallback state (contains NO secret unlock codes or equation answers)
let publicData = {
  stations: {
    1: {
      id: 1,
      type: 'symbol-sequence',
      serial: 'UNIT: G11-SCB // SEC-01 // MK-IV',
      title: 'STATION 01: AIRLOCK ALPHA BLAST DOOR',
      sequenceSlots: [
        { slot: 1, glyph: '☢️' },
        { slot: 2, glyph: '⚙️' },
        { slot: 3, glyph: '🔺' },
        { slot: 4, glyph: '☣️' },
        { slot: 5, glyph: '❄️' },
        { slot: 6, glyph: '☢️' }
      ],
      crtLines: [
        '[SYS] AIRLOCK ALPHA BLAST DOOR SEALED.',
        '[DIR] FIND THE 6 EQUATIONS SCATTERED IN THE ROOM.',
        '[DIR] SOLVE THE VALUE OF EACH HAZARD SYMBOL.',
        '[REQ] INPUT THE 6-SYMBOL SEQUENCE TO UNLOCK DOOR.'
      ],
      showScratchpad: true,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 01 COMPLETE — PROCEED IMMEDIATELY TO STATION 02'
    },
    2: {
      id: 2,
      type: 'code-lock',
      serial: 'UNIT: G11-SCB // SEC-02 // MK-IV',
      title: 'STATION 02: REACTOR CORE OVERRIDE',
      sequenceSlots: [
        { slot: 1, glyph: '⚡' },
        { slot: 2, glyph: '🌡️' },
        { slot: 3, glyph: '🔋' },
        { slot: 4, glyph: '⚡' }
      ],
      crtLines: [
        '[SYS] SECTOR BETA REACTOR CORE CRITICAL.',
        '[DIR] LOCATE THE REACTOR STABILIZATION CLUES AT STATION 02.',
        '[DIR] DETERMINE THE OVERRIDE PASSCODE.',
        '[REQ] ENTER THE PASSCODE TO STABILIZE CORE.'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 02 COMPLETE — PROCEED IMMEDIATELY TO STATION 03'
    },
    3: {
      id: 3,
      type: 'circuit-lab',
      serial: 'UNIT: G11-SCB // SEC-03 // CIRCUIT-MK-IV',
      title: 'STATION 03: EMERGENCY CIRCUIT & CONDUCTOR LAB',
      sequenceSlots: [
        { slot: 1, glyph: '🔋' },
        { slot: 2, glyph: '⚡' },
        { slot: 3, glyph: '🪙' },
        { slot: 4, glyph: '💡' }
      ],
      crtLines: [
        '[SYS] EMERGENCY CORRIDOR LIGHT BULB OFFLINE — WIRE SEVERED.',
        '[DIR] STEP 1: COMPLETE THE ROOM SCAVENGER MATERIALS CHECKLIST.',
        '[DIR] STEP 2: CONSTRUCT THE SIMPLE CIRCUIT (BATTERY + WIRES + BULB).',
        '[REQ] STEP 3: BRIDGE BROKEN WIRE WITH A CONDUCTOR TO LIGHT BULB!'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED // CIRCUIT ENERGIZED',
      victorySubtitle: 'EMERGENCY BULB LIT — HIDDEN DOOR UNLOCKED! PROCEED TO STATION 04',
      circuitMaterials: PUBLIC_CIRCUIT_MATERIALS
    },
    4: {
      id: 4,
      type: 'code-lock',
      serial: 'UNIT: G11-SCB // SEC-04 // MK-IV',
      title: 'STATION 04: CRYO-CONTAINMENT TERMINAL',
      sequenceSlots: [
        { slot: 1, glyph: '❄️' },
        { slot: 2, glyph: '🧪' },
        { slot: 3, glyph: '☣️' },
        { slot: 4, glyph: '❄️' }
      ],
      crtLines: [
        '[SYS] SECTOR DELTA CRYO-CHAMBER SEAL ENGAGED.',
        '[DIR] INSPECT CONTAINMENT LOGS AT STATION 04.',
        '[DIR] IDENTIFY THERMAL OVERRIDE SEQUENCE.',
        '[REQ] ENTER OVERRIDE CODE TO UNLOCK CHAMBER.'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 04 COMPLETE — PROCEED IMMEDIATELY TO STATION 05'
    },
    5: {
      id: 5,
      type: 'code-lock',
      serial: 'UNIT: G11-SCB // SEC-05 // MK-IV',
      title: 'STATION 05: MASTER EVACUATION BLAST DOOR',
      sequenceSlots: [
        { slot: 1, glyph: '🚨' },
        { slot: 2, glyph: '🔓' },
        { slot: 3, glyph: '☢️' },
        { slot: 4, glyph: '🚨' }
      ],
      crtLines: [
        '[SYS] FINAL SURFACE EVACUATION BLAST DOOR.',
        '[DIR] COMBINE FINAL BUNKER CLEARANCE DATA AT STATION 05.',
        '[DIR] AUTHORIZE MASTER EVACUATION SEQUENCE.',
        '[REQ] INPUT MASTER CODE TO ESCAPE THE BUNKER!'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED // BUNKER ESCAPED!',
      victorySubtitle: 'ALL 5 STATIONS CLEARED — SURFACE BLAST DOORS OPEN!'
    }
  }
};

// Protected Admin Data (Only populated after server verifies Operator Passcode)
let adminData = null;
let operatorPasscodeSession = null;

let state = {
  onLandingPage: true, // Start on the Landing Page first!
  stationId: 1,
  slots: ['', '', '', '', '', ''],
  activeSlot: 0,
  unlocked: false,
  sfxEnabled: true,
  circuit: {
    phase: 1,
    scavengerFound: [false, false, false, false],
    batteryInstalled: false,
    wireInstalled: false,
    bulbInstalled: false,
    selectedMaterialId: null,
    lastTestedMaterial: null,
    energized: false
  }
};

function getCurrentStationConfig() {
  if (adminData && adminData.stations && adminData.stations[state.stationId]) {
    return adminData.stations[state.stationId];
  }
  return publicData.stations[state.stationId] || publicData.stations[1];
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

function showLandingScreen() {
  state.onLandingPage = true;
  document.getElementById('bunkerLandingPage').classList.remove('hidden');
  document.getElementById('mainChassis').classList.add('hidden');
  updateLandingPageLabels();
}

function enterBunkerTerminal() {
  playAirlockUnlockSound();
  state.onLandingPage = false;
  document.getElementById('bunkerLandingPage').classList.add('hidden');
  document.getElementById('mainChassis').classList.remove('hidden');
  applyStationToUI();
  renderConsole();
}

function updateLandingPageLabels() {
  const stId = state.stationId;
  const stCfg = getCurrentStationConfig();
  const assignEl = document.getElementById('landingAssignedStation');
  const descEl = document.getElementById('landingStationDesc');
  if (assignEl) assignEl.textContent = `STATION 0${stId}`;
  if (descEl) descEl.textContent = `Assigned Terminal: ${stCfg.title}`;
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
    lastTestedMaterial: null,
    energized: false
  };

  try {
    localStorage.setItem(DEVICE_STATION_STORAGE_KEY, String(stId));
  } catch (e) {}

  history.replaceState(null, '', `#station-${stId}`);

  const stCfg = getCurrentStationConfig();
  const slotCount = (stCfg.sequenceSlots && stCfg.sequenceSlots.length) || 6;
  state.slots = Array(slotCount).fill('');

  updateLandingPageLabels();
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
// PUBLIC CONFIG FETCH
// ============================================================================
async function fetchPublicConfig() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data && data.stations) {
        publicData = data;
      }
    }
  } catch (err) {
    console.warn('Using local public config:', err);
  }
  const stCfg = getCurrentStationConfig();
  const slotCount = (stCfg.sequenceSlots && stCfg.sequenceSlots.length) || 6;
  if (state.slots.length !== slotCount) {
    state.slots = Array(slotCount).fill('');
    state.activeSlot = 0;
  }
  updateLandingPageLabels();
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
    renderCircuitMaterialsTray(stCfg.circuitMaterials || PUBLIC_CIRCUIT_MATERIALS);
    renderCircuitLabState();
  } else {
    circuitTelMod.classList.add('hidden');
    circuitLabMod.classList.add('hidden');
    lockMod.classList.remove('hidden');
    scratchMod.style.display = stCfg.showScratchpad ? 'block' : 'none';

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

  // 4. Full-Screen Green Takeover Texts
  document.getElementById('greenStatusPill').textContent =
    `STATION 0${stId} AUTHORIZATION VERIFIED // OVERRIDE COMPLETE`;
  document.getElementById('greenVictoryTitle').textContent =
    stCfg.victoryTitle || 'ACCESS GRANTED';
  document.getElementById('greenVictorySubtitle').textContent =
    stCfg.victorySubtitle || 'BLAST DOOR UNSEALED';

  if (adminData) {
    populateBackendPortalForStation(stId, adminData.stations[stId]);
  }
}

function updateGreenVerifiedBadges(verifiedSlots) {
  const verifiedRow = document.getElementById('greenVerifiedRow');
  if (!verifiedRow) return;
  const slotsArr = verifiedSlots || getCurrentStationConfig().sequenceSlots || [];
  verifiedRow.innerHTML = slotsArr
    .map(
      (s, idx) => `
      <div class="green-seq-card">
        <span class="green-seq-sym">${s.glyph}</span>
        <span class="green-seq-val">${s.value !== undefined ? s.value : state.slots[idx] || '✓'}</span>
      </div>
    `
    )
    .join('');
}

// ============================================================================
// STATION 03: INTERACTIVE 2-PHASE SIMPLE CIRCUIT & CONDUCTOR MATERIAL LAB
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
      state.circuit.lastTestedMaterial = null;
      state.circuit.energized = false;

      const mats = getCurrentStationConfig().circuitMaterials || PUBLIC_CIRCUIT_MATERIALS;
      const chosen = mats.find((m) => m.id === state.circuit.selectedMaterialId);
      if (chosen) {
        const vfd = document.getElementById('circuitVfdReadout');
        vfd.className = 'vfd-text';
        vfd.style.color = '';
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
  const mats = getCurrentStationConfig().circuitMaterials || PUBLIC_CIRCUIT_MATERIALS;
  const chosenMat = mats.find((m) => m.id === c.selectedMaterialId) || null;
  const tested = c.lastTestedMaterial;

  const phase1Box = document.getElementById('st3Phase1Box');
  const phase2Box = document.getElementById('st3Phase2Box');
  const phaseHeaderCode = document.getElementById('st3PhaseHeaderCode');
  const statusChip = document.getElementById('circuitStatusChip');

  const foundArr = Array.isArray(c.scavengerFound) ? c.scavengerFound : [false, false, false, false];
  const foundCount = foundArr.filter(Boolean).length;
  const allScavFound = foundCount === 4;

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

  // Node 1: 12V Battery
  const batBtn = document.getElementById('nodeBatteryBtn');
  const batVis = document.getElementById('nodeBatteryVisual');
  const batTag = document.getElementById('nodeBatteryTag');
  batBtn.classList.toggle('installed', c.batteryInstalled);
  batVis.textContent = c.batteryInstalled ? '🔋 12V BUNKER CELL MOUNTED' : '🔋 CLICK TO MOUNT 12V BATTERY';
  batTag.textContent = c.batteryInstalled ? '12.0 V READY' : 'EMPTY SOCKET';

  // Node 2: Copper Wire Lead
  const wireBtn = document.getElementById('nodeWireBtn');
  const wireVis = document.getElementById('nodeWireVisual');
  const wireTag = document.getElementById('nodeWireTag');
  wireBtn.classList.toggle('installed', c.wireInstalled);
  wireVis.textContent = c.wireInstalled ? '⚡ COPPER BUS WIRE CONNECTED' : '➕ CLICK TO CONNECT COPPER WIRE';
  wireTag.textContent = c.wireInstalled ? 'CONNECTED' : 'DISCONNECTED';

  // Node 3: Emergency Light Bulb
  const bulbBtn = document.getElementById('nodeBulbBtn');
  const bulbVis = document.getElementById('nodeBulbVisual');
  const bulbTag = document.getElementById('nodeBulbTag');
  bulbBtn.classList.toggle('installed', c.bulbInstalled);
  bulbVis.textContent = c.bulbInstalled ? '💡 TUNGSTEN BULB SCREWED IN' : '💡 CLICK TO SCREW IN LIGHT BULB';
  bulbTag.textContent = c.bulbInstalled ? 'MOUNTED' : 'UNINSTALLED';

  // Node 4: Clamped Material Display
  const gapBox = document.getElementById('nodeGapBox');
  const clampedDisp = document.getElementById('clampedMaterialDisplay');
  if (chosenMat) {
    gapBox.classList.add('installed');
    clampedDisp.innerHTML = `${chosenMat.icon} <strong>${chosenMat.name}</strong> CLAMPED IN GAP`;
  } else {
    gapBox.classList.remove('installed');
    clampedDisp.textContent = '⚠️ WIRE SEVERED — SELECT A MATERIAL BELOW';
  }

  // Center Bulb Dome & Traces
  const bulbDome = document.getElementById('bulbDome');
  const beaconCap = document.getElementById('beaconCaption');
  const electronTrace = document.getElementById('electronTrace');
  const baseTrace = document.querySelector('.trace-base');

  const hardwareReady = c.batteryInstalled && c.wireInstalled && c.bulbInstalled;
  if (baseTrace) {
    baseTrace.classList.toggle('assembled-trace', hardwareReady);
  }

  if (c.energized && tested && tested.isConductor) {
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

  // Left Bay Multimeter & Checklist
  document.getElementById('cstep-battery').classList.toggle('done', c.batteryInstalled);
  document.getElementById('cstep-wire').classList.toggle('done', c.wireInstalled);
  document.getElementById('cstep-bulb').classList.toggle('done', c.bulbInstalled);
  document.getElementById('cstep-material').classList.toggle('done', !!(tested && tested.isConductor && c.energized));

  const mVolt = document.getElementById('meterVoltage');
  const mCurr = document.getElementById('meterCurrent');
  const mRes = document.getElementById('meterResistance');
  const mLum = document.getElementById('meterLumens');

  mVolt.textContent = c.batteryInstalled ? '12.0 V' : '0.0 V';
  mRes.textContent = tested ? tested.resistance : '--- Ω';

  if (c.energized && tested && tested.isConductor) {
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
  const mats = getCurrentStationConfig().circuitMaterials || PUBLIC_CIRCUIT_MATERIALS;
  const chosenMat = mats.find((m) => m.id === c.selectedMaterialId) || null;

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

  if (!chosenMat) {
    playAlarmBuzzer();
    vfd.className = 'vfd-text vfd-error';
    vfd.textContent = '⚠️ WIRE GAP OPEN! SELECT A MATERIAL BELOW TO REPLACE THE BROKEN WIRE';
    appendCrtLog('ERR', 'NO MATERIAL CLAMPED IN BROKEN WIRE GAP.');
    triggerConsoleShake(labMod);
    return;
  }

  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stationId: 3,
        materialId: chosenMat.id
      })
    });

    if (res.ok) {
      const result = await res.json();
      const matRes = result.materialResult || {
        id: chosenMat.id,
        name: chosenMat.name,
        isConductor: ['copper', 'nail', 'foil', 'key'].includes(chosenMat.id),
        resistance: ['copper', 'nail', 'foil', 'key'].includes(chosenMat.id) ? '0.04 Ω' : '∞ Ω',
        reason: ['copper', 'nail', 'foil', 'key'].includes(chosenMat.id)
          ? 'Metallic conductor bridges the broken wire!'
          : 'Insulator blocks electrical current.'
      };

      c.lastTestedMaterial = matRes;

      if (result.success) {
        c.energized = true;
        renderCircuitLabState();
        playAirlockUnlockSound();

        vfd.className = 'vfd-text';
        vfd.style.color = '#34d399';
        vfd.textContent = `✅ ${matRes.reason.toUpperCase()} — BULB IGNITED!`;
        appendCrtLog('PASS', `${matRes.name} CONDUCTS CURRENT! BULB LIT!`, true);

        const chip = document.getElementById('circuitStatusChip');
        chip.textContent = '💡 CIRCUIT ENERGIZED // BULB LIT';
        chip.className = 'security-chip unlocked';

        updateGreenVerifiedBadges(result.verifiedSlots);

        setTimeout(() => {
          state.unlocked = true;
          renderConsole();
        }, 1600);
      } else {
        c.energized = false;
        renderCircuitLabState();
        playAlarmBuzzer();
        vfd.className = 'vfd-text vfd-error';
        vfd.textContent = `❌ BULB DID NOT LIGHT: ${matRes.reason.toUpperCase()}`;
        appendCrtLog('FAIL', `${matRes.name} IS AN INSULATOR (0.00 A).`);
        triggerConsoleShake(labMod);
      }
    }
  } catch (err) {
    console.error('Verification error:', err);
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
    lastTestedMaterial: null,
    energized: false
  };
  const vfd = document.getElementById('circuitVfdReadout');
  vfd.className = 'vfd-text';
  vfd.style.color = '';
  vfd.textContent = 'CLICK SLOTS 1, 2 & 3 ON THE CIRCUIT BOARD TO CONSTRUCT THE CIRCUIT...';

  const mats = getCurrentStationConfig().circuitMaterials || PUBLIC_CIRCUIT_MATERIALS;
  renderCircuitMaterialsTray(mats);
  renderCircuitLabState();
}

// ============================================================================
// PROTECTED OPERATOR BACKEND AUTHENTICATION & PORTAL
// ============================================================================
function openBackendAuthPrompt() {
  playControlClick();
  // If already authenticated in this session, open the Backend Portal directly
  if (operatorPasscodeSession && adminData) {
    populateBackendPortalForStation(state.stationId, adminData.stations[state.stationId]);
    document.getElementById('backendModal').classList.remove('hidden');
    return;
  }

  const authModal = document.getElementById('backendAuthModal');
  const passInput = document.getElementById('operatorPasscodeInput');
  const errEl = document.getElementById('authErrorMsg');
  errEl.textContent = '';
  passInput.value = '';
  authModal.classList.remove('hidden');
  setTimeout(() => passInput.focus(), 50);
}

async function authenticateOperator(passcode) {
  const errEl = document.getElementById('authErrorMsg');
  const authBox = document.getElementById('authGateBox');

  try {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'fetch', passcode })
    });

    if (res.ok) {
      adminData = await res.json();
      operatorPasscodeSession = passcode;
      playAirlockUnlockSound();
      document.getElementById('backendAuthModal').classList.add('hidden');
      populateBackendPortalForStation(state.stationId, adminData.stations[state.stationId]);
      document.getElementById('backendModal').classList.remove('hidden');
    } else {
      playAlarmBuzzer();
      errEl.textContent = '❌ ACCESS DENIED: INVALID OPERATOR PASSCODE';
      triggerConsoleShake(authBox);
    }
  } catch (err) {
    errEl.textContent = '❌ CONNECTION ERROR';
  }
}

function populateBackendPortalForStation(stId, stCfg) {
  if (!stCfg) return;

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
    if (adminData && adminData.station1Symbols) {
      Object.keys(adminData.station1Symbols).forEach((k) => {
        const inp = document.getElementById(`cfg-sym-${k}`);
        if (inp) inp.value = adminData.station1Symbols[k].value;
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
  let isCorrect = false;

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
      if (result.verifiedSlots) {
        updateGreenVerifiedBadges(result.verifiedSlots);
      }
    }
  } catch (err) {
    console.error('Verification error:', err);
  }

  if (isCorrect) {
    playAirlockUnlockSound();
    state.unlocked = true;
    appendCrtLog('AUTH', `SEQUENCE VERIFIED. ACCESS GRANTED!`, true);
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

function resetAirlockSystem(returnToLanding = true) {
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
  if (returnToLanding) {
    showLandingScreen();
  }
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
  showLandingScreen();
  fetchPublicConfig();

  // Landing Page -> Enter Bunker Terminal Button
  document.getElementById('enterTerminalBtn').addEventListener('click', enterBunkerTerminal);

  // Return to Landing Screen Button in Top Header
  document.getElementById('backToLandingBtn').addEventListener('click', () => {
    playControlClick();
    showLandingScreen();
  });

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

  // ==================== RESTRICTED OPERATOR AUTH TRIGGERS ====================
  // 1. Stealth Lock Button in Landing Page Footer
  document.getElementById('stealthCrewBtn').addEventListener('click', openBackendAuthPrompt);

  // 2. Triple-click on Hardware Serial Nameplate inside Terminal
  let nameplateClicks = 0;
  let nameplateTimer = null;
  document.getElementById('secretNameplateTrigger').addEventListener('click', () => {
    nameplateClicks += 1;
    clearTimeout(nameplateTimer);
    if (nameplateClicks >= 3) {
      nameplateClicks = 0;
      openBackendAuthPrompt();
    } else {
      nameplateTimer = setTimeout(() => {
        nameplateClicks = 0;
      }, 900);
    }
  });

  // 3. Operator Auth Form Submit
  document.getElementById('operatorAuthForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('operatorPasscodeInput').value;
    authenticateOperator(pass);
  });

  document.getElementById('cancelAuthBtn').addEventListener('click', () => {
    playControlClick();
    document.getElementById('backendAuthModal').classList.add('hidden');
  });

  document.getElementById('lockBackendBtn').addEventListener('click', () => {
    playControlClick();
    operatorPasscodeSession = null;
    adminData = null;
    document.getElementById('backendModal').classList.add('hidden');
  });

  // Device Station Selector Pills inside Authenticated Backend Modal
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

  // Full-Screen Green Reset Button (Returns to Landing Page for next team)
  document.getElementById('greenResetBtn').addEventListener('click', () => resetAirlockSystem(true));

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
  document.getElementById('closeBackendBtn').addEventListener('click', () => {
    playControlClick();
    backendModal.classList.add('hidden');
  });

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

  // Save Station Settings to Protected Backend
  document.getElementById('saveBackendConfigBtn').addEventListener('click', async () => {
    if (!operatorPasscodeSession) return;
    const stId = state.stationId;
    const payload = {
      passcode: operatorPasscodeSession,
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
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        adminData = await res.json();
        await fetchPublicConfig();
        assignDeviceToStation(stId);
        playAirlockUnlockSound();
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
    if (!operatorPasscodeSession) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: operatorPasscodeSession, resetDefaults: true })
      });
      if (res.ok) {
        adminData = await res.json();
        await fetchPublicConfig();
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
    state.onLandingPage = false;
    document.getElementById('bunkerLandingPage').classList.add('hidden');
    document.getElementById('mainChassis').classList.remove('hidden');
    playAirlockUnlockSound();
    if (adminData && adminData.stations[state.stationId]) {
      updateGreenVerifiedBadges(adminData.stations[state.stationId].sequenceSlots);
    }
    state.unlocked = true;
    renderConsole();
  });

  // Operator Quick Override: Force Re-lock
  document.getElementById('forceRelockBtn').addEventListener('click', () => {
    backendModal.classList.add('hidden');
    resetAirlockSystem(false);
  });

  // Physical Keyboard Support & Secret Operator Shortcut (Ctrl+Shift+B or Alt+B)
  window.addEventListener('keydown', (e) => {
    // Secret Operator Shortcut: Ctrl+Shift+B or Alt+B
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'b') || (e.altKey && e.key.toLowerCase() === 'b')) {
      e.preventDefault();
      openBackendAuthPrompt();
      return;
    }

    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (state.unlocked) {
      if (e.key === 'Escape') {
        resetAirlockSystem(true);
      }
      return;
    }

    const authModal = document.getElementById('backendAuthModal');
    if (!authModal.classList.contains('hidden')) {
      if (e.key === 'Escape') authModal.classList.add('hidden');
      return;
    }

    if (!backendModal.classList.contains('hidden')) {
      if (e.key === 'Escape') backendModal.classList.add('hidden');
      return;
    }

    if (state.onLandingPage) {
      if (e.key === 'Enter') {
        enterBunkerTerminal();
      }
      return;
    }

    if (getCurrentStationConfig().type === 'circuit-lab') {
      if (e.key === 'Enter' && state.circuit.phase === 2) {
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

  // If URL ends with #admin or #backend, prompt for Operator Passcode first
  if (['#backend', '#admin'].includes(window.location.hash)) {
    openBackendAuthPrompt();
  }
});

function animateKeycapPress(keyVal) {
  const btn = document.querySelector(`#mechKeypad .mech-key[data-key="${keyVal}"]`);
  if (!btn) return;
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}
