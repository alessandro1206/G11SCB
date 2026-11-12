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

// Default Backend Configuration (Clues, Symbol Values, Materials, Settings)
const DEFAULT_BACKEND_DATA = {
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
  // Door Sequence Order (6 slots)
  sequenceOrder: ['radiation', 'gear', 'triangle', 'biohazard', 'snowflake', 'radiation'],
  // Required physical & setup materials for G11 SCB Escape Room Crew
  materialsChecklist: [
    {
      id: 'mat-1',
      item: '6 Printed Symbol Equation Clue Cards',
      detail: 'Print Directly from the Backend Clues Tab and cut out the 6 cards to hide around the bunker room.',
      category: 'PRINTABLE PROPS'
    },
    {
      id: 'mat-2',
      item: '1 Laptop / Tablet / Monitor at the Blast Door Station',
      detail: 'Open this website in Fullscreen mode (click FULLSCREEN in top bar) with speaker volume turned up to 70-80%.',
      category: 'HARDWARE'
    },
    {
      id: 'mat-3',
      item: 'UV Flashlight / Red Filter / Tape (Optional Hiding Props)',
      detail: 'Tape the 6 equation cards under tables, inside ammo crates, behind hazard signs, or inside folders in the bunker.',
      category: 'ROOM SETUP'
    },
    {
      id: 'mat-4',
      item: 'Scratch Paper & Pens (or use Built-in Terminal Scratchpad)',
      detail: 'Players can calculate symbol values on paper or use the built-in Symbol Value Log on the left side of the screen.',
      category: 'PLAYER GEAR'
    }
  ],
  stats: {
    attempts: 0,
    solves: 0,
    lastSolvedAt: null
  }
};

const TMP_CONFIG_PATH = path.join(os.tmpdir(), 'g11scb_bunker_backend_config.json');

function loadBackendData() {
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const raw = fs.readFileSync(TMP_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_BACKEND_DATA, ...parsed };
    }
  } catch (err) {
    // fallback to default
  }
  return JSON.parse(JSON.stringify(DEFAULT_BACKEND_DATA));
}

function saveBackendData(data) {
  try {
    fs.writeFileSync(TMP_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // ignore write errors in read-only environments
  }
}

// Compute the 6 scattered equations and 6-digit target code dynamically from symbol values
function buildComputedState(data) {
  const s = data.symbols;
  const equations = [
    {
      id: 1,
      title: 'CLUE CARD #01',
      leftA: s.radiation.glyph,
      leftB: s.radiation.glyph,
      sum: s.radiation.value + s.radiation.value,
      formula: `${s.radiation.glyph} + ${s.radiation.glyph} = ${s.radiation.value + s.radiation.value}`,
      solutionNote: `${s.radiation.glyph} = ${s.radiation.value}`,
      hidingSuggestion: 'Hide near entrance airlock or under main briefing table.'
    },
    {
      id: 2,
      title: 'CLUE CARD #02',
      leftA: s.radiation.glyph,
      leftB: s.gear.glyph,
      sum: s.radiation.value + s.gear.value,
      formula: `${s.radiation.glyph} + ${s.gear.glyph} = ${s.radiation.value + s.gear.value}`,
      solutionNote: `${s.gear.glyph} = ${s.gear.value} (since ${s.radiation.glyph} = ${s.radiation.value})`,
      hidingSuggestion: 'Hide inside generator/fuse box prop or taped behind a tool.'
    },
    {
      id: 3,
      title: 'CLUE CARD #03',
      leftA: s.gear.glyph,
      leftB: s.triangle.glyph,
      sum: s.gear.value + s.triangle.value,
      formula: `${s.gear.glyph} + ${s.triangle.glyph} = ${s.gear.value + s.triangle.value}`,
      solutionNote: `${s.triangle.glyph} = ${s.triangle.value} (since ${s.gear.glyph} = ${s.gear.value})`,
      hidingSuggestion: 'Hide near warning wall poster or emergency supply crate.'
    },
    {
      id: 4,
      title: 'CLUE CARD #04',
      leftA: s.triangle.glyph,
      leftB: s.biohazard.glyph,
      sum: s.triangle.value + s.biohazard.value,
      formula: `${s.triangle.glyph} + ${s.biohazard.glyph} = ${s.triangle.value + s.biohazard.value}`,
      solutionNote: `${s.biohazard.glyph} = ${s.biohazard.value} (since ${s.triangle.glyph} = ${s.triangle.value})`,
      hidingSuggestion: 'Hide near decontamination / medical kit prop.'
    },
    {
      id: 5,
      title: 'CLUE CARD #05',
      leftA: s.biohazard.glyph,
      leftB: s.snowflake.glyph,
      sum: s.biohazard.value + s.snowflake.value,
      formula: `${s.biohazard.glyph} + ${s.snowflake.glyph} = ${s.biohazard.value + s.snowflake.value}`,
      solutionNote: `${s.snowflake.glyph} = ${s.snowflake.value} (since ${s.biohazard.glyph} = ${s.biohazard.value})`,
      hidingSuggestion: 'Hide near air vent / cooling unit area.'
    },
    {
      id: 6,
      title: 'CLUE CARD #06',
      leftA: s.snowflake.glyph,
      leftB: s.snowflake.glyph,
      sum: s.snowflake.value + s.snowflake.value,
      formula: `${s.snowflake.glyph} + ${s.snowflake.glyph} = ${s.snowflake.value + s.snowflake.value}`,
      solutionNote: `${s.snowflake.glyph} = ${s.snowflake.value} (double-check confirmation clue)`,
      hidingSuggestion: 'Hide inside locker or under keyboard.'
    }
  ];

  const sequenceSlots = data.sequenceOrder.map((symKey, index) => {
    const symObj = s[symKey] || s.radiation;
    return {
      slot: index + 1,
      id: symObj.id,
      glyph: symObj.glyph,
      name: symObj.name,
      value: String(symObj.value)
    };
  });

  const targetCode = sequenceSlots.map((slot) => slot.value).join('');

  return {
    ...data,
    equations,
    sequenceSlots,
    targetCode
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

    // ==================== BACKEND API ROUTES ====================
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

      if (typeof body.stationName === 'string' && body.stationName.trim()) {
        current.stationName = body.stationName.trim();
      }
      if (typeof body.victoryTitle === 'string' && body.victoryTitle.trim()) {
        current.victoryTitle = body.victoryTitle.trim();
      }
      if (typeof body.victorySubtitle === 'string' && body.victorySubtitle.trim()) {
        current.victorySubtitle = body.victorySubtitle.trim();
      }
      if (typeof body.showScratchpad === 'boolean') {
        current.showScratchpad = body.showScratchpad;
      }
      if (body.symbolValues && typeof body.symbolValues === 'object') {
        Object.keys(body.symbolValues).forEach((key) => {
          if (current.symbols[key]) {
            const num = parseInt(body.symbolValues[key], 10);
            if (!isNaN(num) && num >= 0 && num <= 9) {
              current.symbols[key].value = num;
            }
          }
        });
      }
      if (Array.isArray(body.sequenceOrder) && body.sequenceOrder.length === 6) {
        current.sequenceOrder = body.sequenceOrder.map((k) =>
          current.symbols[k] ? k : 'radiation'
        );
      }

      saveBackendData(current);
      return sendJson(res, 200, buildComputedState(current));
    }

    if (safeUrl === '/api/verify' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const current = loadBackendData();
      const computed = buildComputedState(current);

      const enteredCode = Array.isArray(body.slots)
        ? body.slots.join('')
        : String(body.code || '');

      current.stats = current.stats || { attempts: 0, solves: 0, lastSolvedAt: null };
      current.stats.attempts += 1;

      const success = enteredCode === computed.targetCode;
      if (success) {
        current.stats.solves += 1;
        current.stats.lastSolvedAt = new Date().toISOString();
      }
      saveBackendData(current);

      return sendJson(res, 200, {
        success,
        enteredCode,
        victoryTitle: current.victoryTitle,
        victorySubtitle: current.victorySubtitle,
        stats: current.stats
      });
    }

    // ==================== STATIC FILES ====================
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
    console.log(`G11 SCB Bunker Control Panel & Backend running at http://localhost:${PORT}`);
  });
}
