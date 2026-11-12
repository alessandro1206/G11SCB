const http = require('http');
const fs = require('fs');
const path = require('path');

// Explicit static paths so Vercel's file tracer (@vercel/nft) always bundles them
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

function requestHandler(req, res) {
  try {
    const safeUrl = (req.url || '/').split('?')[0];
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

// Export handler for Vercel Node.js runtime
module.exports = requestHandler;

// Also start HTTP server if executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`G11 SCB Bunker Control Panel running at http://localhost:${PORT}`);
  });
}
