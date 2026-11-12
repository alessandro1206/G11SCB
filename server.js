const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Explicit static file references so Vercel's @vercel/nft bundles all frontend assets
const STATIC_FILES = {
  '/': {
    file: path.join(__dirname, 'index.html'),
    type: 'text/html; charset=utf-8'
  },
  '/index.html': {
    file: path.join(__dirname, 'index.html'),
    type: 'text/html; charset=utf-8'
  },
  '/styles.css': {
    file: path.join(__dirname, 'styles.css'),
    type: 'text/css; charset=utf-8'
  },
  '/bunker.js': {
    file: path.join(__dirname, 'bunker.js'),
    type: 'application/javascript; charset=utf-8'
  }
};

// Default Backend Configuration for ALL 5 BUNKER CHALLENGES
const DEFAULT_BACKEND_DATA = {
  // Challenge 1: Symbol Equation Lock (Allen's Game)
  station1Symbols: {
    radiation: { id: 'radiation', glyph: '☢️', name: 'RADIATION', value: 5 },
    gear: { id: 'gear', glyph: '⚙️', name: 'MECHANICAL GEAR', value: 7 },
    triangle: { id: 'triangle', glyph: '🔺', name: 'DELTA HAZARD', value: 8 },
    biohazard: { id: 'biohazard', glyph: '☣️', name: 'BIOHAZARD', value: 5 },
    snowflake: { id: 'snowflake', glyph: '❄️', name: 'CRYO-FROST', value: 6 }
  },
  station1SequenceOrder: ['radiation', 'gear', 'triangle', 'biohazard', 'snowflake', 'radiation'],

  // All 5 Stations Configuration
  stations: {
    1: {
      id: 1,
      type: 'symbol-sequence',
      serial: 'UNIT: G11-SCB // SEC-01 // MK-IV',
      title: 'STATION 01: AIRLOCK ALPHA BLAST DOOR',
      crtLines: [
        '[SYS] AIRLOCK ALPHA BLAST DOOR SEALED.',
        '[DIR] FIND THE 6 EQUATIONS SCATTERED IN THE ROOM.',
        '[DIR] SOLVE THE VALUE OF EACH HAZARD SYMBOL.',
        '[REQ] INPUT THE 6-SYMBOL SEQUENCE TO UNLOCK DOOR.'
      ],
      showScratchpad: true,
      victoryTitle: 'ACCESS GRANTED',
      victorySubtitle: 'STATION 01 COMPLETE — PROCEED IMMEDIATELY TO STATION 02',
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
      slotGlyphs: ['⚡', '🌡️', '🔋', '⚡', '☢️', '⚙️'],
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
      crtLines: [
        '[SYS] EMERGENCY CORRIDOR LIGHT BULB OFFLINE — WIRE SEVERED.',
        '[DIR] STEP 1: ASSEMBLE THE SIMPLE CIRCUIT (BATTERY + WIRES + BULB).',
        '[DIR] STEP 2: SELECT A CONDUCTIVE MATERIAL TO REPLACE THE BROKEN WIRE.',
        '[REQ] STEP 3: ENGAGE BREAKER TO LIGHT UP THE BULB & REVEAL THE DOOR!'
      ],
      showScratchpad: false,
      victoryTitle: 'ACCESS GRANTED // CIRCUIT ENERGIZED',
      victorySubtitle: 'EMERGENCY BULB LIT — HIDDEN DOOR UNLOCKED! PROCEED TO STATION 04',
      circuitMaterials: [
        { id: 'wood', name: 'DRY WOODEN STICK', icon: '🪵', isConductor: false, resistance: '∞ Ω', reason: 'Wood is an electrical insulator — electrons cannot flow through it.' },
        { id: 'copper', name: 'COPPER WIRE / COIN', icon: '🪙', isConductor: true, resistance: '0.02 Ω', reason: 'Copper is an excellent metallic conductor! Current flows to light the bulb.' },
        { id: 'rubber', name: 'RUBBER ERASER STRIP', icon: '🛞', isConductor: false, resistance: '∞ Ω', reason: 'Rubber is a high-resistance insulator used to block electricity.' },
        { id: 'nail', name: 'IRON / STEEL NAIL', icon: '🔩', isConductor: true, resistance: '0.09 Ω', reason: 'Iron/Steel is a conductive metal that bridges the broken wire gap!' },
        { id: 'plastic', name: 'PLASTIC RULER', icon: '📏', isConductor: false, resistance: '∞ Ω', reason: 'Plastic is a polymer insulator — circuit remains open.' },
        { id: 'foil', name: 'ALUMINUM FOIL STRIP', icon: '✨', isConductor: true, resistance: '0.04 Ω', reason: 'Aluminum is a lightweight metal conductor that completes the circuit!' },
        { id: 'glass', name: 'GLASS TEST ROD', icon: '🧪', isConductor: false, resistance: '∞ Ω', reason: 'Glass is a dielectric insulator — zero current flow.' },
        { id: 'key', name: 'BRASS / METAL KEY', icon: '🔑', isConductor: true, resistance: '0.06 Ω', reason: 'Brass/Metal alloy conducts electricity and ignites the emergency bulb!' }
      ],
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
      slotGlyphs: ['❄️', '🧪', '☣️', '❄️', '🧬', '🛡️'],
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
      slotGlyphs: ['🚨', '🔓', '☢️', '⚙️', '🔺', '🚨'],
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

const TMP_CONFIG_PATH = path.join(os.tmpdir(), 'g11scb_bunker_multistation_v3.json');

function loadBackendData() {
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const raw = fs.readFileSync(TMP_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_BACKEND_DATA, ...parsed };
    }
  } catch (err) {
    // fallback
  }
  return JSON.parse(JSON.stringify(DEFAULT_BACKEND_DATA));
}

function saveBackendData(data) {
  try {
    fs.writeFileSync(TMP_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // ignore in read-only env
  }
}

function buildComputedState(data) {
  const s = data.station1Symbols;
  const station1Equations = [
    {
      id: 1,
      title: 'STATION 01 // CLUE CARD #01',
      formula: `${s.radiation.glyph} + ${s.radiation.glyph} = ${s.radiation.value + s.radiation.value}`,
      solutionNote: `${s.radiation.glyph} = ${s.radiation.value}`,
      hidingSuggestion: 'Hide near entrance airlock or under main briefing table.'
    },
    {
      id: 2,
      title: 'STATION 01 // CLUE CARD #02',
      formula: `${s.radiation.glyph} + ${s.gear.glyph} = ${s.radiation.value + s.gear.value}`,
      solutionNote: `${s.gear.glyph} = ${s.gear.value} (since ${s.radiation.glyph} = ${s.radiation.value})`,
      hidingSuggestion: 'Hide inside generator/fuse box prop or taped behind a tool.'
    },
    {
      id: 3,
      title: 'STATION 01 // CLUE CARD #03',
      formula: `${s.gear.glyph} + ${s.triangle.glyph} = ${s.gear.value + s.triangle.value}`,
      solutionNote: `${s.triangle.glyph} = ${s.triangle.value} (since ${s.gear.glyph} = ${s.gear.value})`,
      hidingSuggestion: 'Hide near warning wall poster or emergency supply crate.'
    },
    {
      id: 4,
      title: 'STATION 01 // CLUE CARD #04',
      formula: `${s.triangle.glyph} + ${s.biohazard.glyph} = ${s.triangle.value + s.biohazard.value}`,
      solutionNote: `${s.biohazard.glyph} = ${s.biohazard.value} (since ${s.triangle.glyph} = ${s.triangle.value})`,
      hidingSuggestion: 'Hide near decontamination / medical kit prop.'
    },
    {
      id: 5,
      title: 'STATION 01 // CLUE CARD #05',
      formula: `${s.biohazard.glyph} + ${s.snowflake.glyph} = ${s.biohazard.value + s.snowflake.value}`,
      solutionNote: `${s.snowflake.glyph} = ${s.snowflake.value} (since ${s.biohazard.glyph} = ${s.biohazard.value})`,
      hidingSuggestion: 'Hide near air vent / cooling unit area.'
    },
    {
      id: 6,
      title: 'STATION 01 // CLUE CARD #06',
      formula: `${s.snowflake.glyph} + ${s.snowflake.glyph} = ${s.snowflake.value + s.snowflake.value}`,
      solutionNote: `${s.snowflake.glyph} = ${s.snowflake.value}`,
      hidingSuggestion: 'Hide inside locker or under keyboard.'
    }
  ];

  const st1SequenceSlots = data.station1SequenceOrder.map((symKey, index) => {
    const symObj = s[symKey] || s.radiation;
    return {
      slot: index + 1,
      id: symObj.id,
      glyph: symObj.glyph,
      name: symObj.name,
      value: String(symObj.value)
    };
  });

  const st1Code = st1SequenceSlots.map((slot) => slot.value).join('');

  const computedStations = JSON.parse(JSON.stringify(data.stations));
  computedStations[1].code = st1Code;
  computedStations[1].sequenceSlots = st1SequenceSlots;
  computedStations[1].equations = station1Equations;

  // Build slot descriptors for code-lock stations
  [2, 4, 5].forEach((i) => {
    const st = computedStations[i];
    if (!st) return;
    const codeStr = String(st.code || '0000');
    const glyphs = st.slotGlyphs || ['⚡', '🔒', '☢️', '⚙️', '🔺', '❄️'];
    st.sequenceSlots = codeStr.split('').map((digit, idx) => ({
      slot: idx + 1,
      glyph: glyphs[idx % glyphs.length],
      value: digit
    }));
  });

  // Station 3 verified display badges for Full-Screen Green screen
  if (computedStations[3]) {
    computedStations[3].sequenceSlots = [
      { slot: 1, glyph: '🔋', value: '12V' },
      { slot: 2, glyph: '⚡', value: 'WIRE' },
      { slot: 3, glyph: '🪙', value: 'METAL' },
      { slot: 4, glyph: '💡', value: 'LIT' }
    ];
  }

  return {
    station1Symbols: data.station1Symbols,
    station1SequenceOrder: data.station1SequenceOrder,
    stations: computedStations
  };
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function requestHandler(req, res) {
  try {
    const safeUrl = (req.url || '/').split('?')[0];

    if (safeUrl === '/api/config' && req.method === 'GET') {
      const data = loadBackendData();
      return sendJson(res, 200, buildComputedState(data));
    }

    if (safeUrl === '/api/config' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const current = loadBackendData();

      if (body.resetDefaults) {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_BACKEND_DATA));
        saveBackendData(fresh);
        return sendJson(res, 200, buildComputedState(fresh));
      }

      const stId = parseInt(body.stationId, 10) || 1;

      if (stId === 1 && body.symbolValues && typeof body.symbolValues === 'object') {
        Object.keys(body.symbolValues).forEach((key) => {
          if (current.station1Symbols[key]) {
            const num = parseInt(body.symbolValues[key], 10);
            if (!isNaN(num) && num >= 0 && num <= 9) {
              current.station1Symbols[key].value = num;
            }
          }
        });
      }

      if (current.stations[stId]) {
        const st = current.stations[stId];
        if (typeof body.title === 'string' && body.title.trim()) st.title = body.title.trim();
        if (typeof body.victoryTitle === 'string' && body.victoryTitle.trim()) st.victoryTitle = body.victoryTitle.trim();
        if (typeof body.victorySubtitle === 'string' && body.victorySubtitle.trim()) st.victorySubtitle = body.victorySubtitle.trim();
        if (typeof body.showScratchpad === 'boolean') st.showScratchpad = body.showScratchpad;

        if (st.type === 'code-lock' && typeof body.code === 'string' && body.code.trim()) {
          st.code = body.code.trim().replace(/\s+/g, '').slice(0, 8);
        }
        if (st.type === 'circuit-lab' && Array.isArray(body.circuitMaterials)) {
          st.circuitMaterials = body.circuitMaterials;
        }
        if (st.type === 'code-lock' && typeof body.clueFormula === 'string' && body.clueFormula.trim()) {
          st.clues = [
            {
              title: `STATION 0${stId} CLUE CARD`,
              formula: body.clueFormula.trim(),
              note: `Unlock Code: ${st.code}`
            }
          ];
        }
      }

      saveBackendData(current);
      return sendJson(res, 200, buildComputedState(current));
    }

    if (safeUrl === '/api/verify' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const stId = parseInt(body.stationId, 10) || 1;
      const current = loadBackendData();
      const computed = buildComputedState(current);
      const targetStation = computed.stations[stId] || computed.stations[1];

      current.stations[stId].stats = current.stations[stId].stats || { attempts: 0, solves: 0 };
      current.stations[stId].stats.attempts += 1;

      let success = false;
      if (targetStation.type === 'circuit-lab') {
        success = !!body.circuitComplete;
      } else {
        const enteredCode = Array.isArray(body.slots)
          ? body.slots.join('')
          : String(body.code || '');
        success = enteredCode === String(targetStation.code);
      }

      if (success) {
        current.stations[stId].stats.solves += 1;
      }
      saveBackendData(current);

      return sendJson(res, 200, {
        success,
        stationId: stId,
        victoryTitle: targetStation.victoryTitle,
        victorySubtitle: targetStation.victorySubtitle,
        stats: current.stations[stId].stats
      });
    }

    const entry = STATIC_FILES[safeUrl] || STATIC_FILES['/'];
    const content = fs.readFileSync(entry.file);

    res.statusCode = 200;
    res.setHeader('Content-Type', entry.type);
    res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server Error: ' + err.message);
  }
}

module.exports = requestHandler;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`G11 SCB Bunker Control Panel & Multi-Station Backend running at http://localhost:${PORT}`);
  });
}
