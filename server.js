const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Remove query string and hash
  let urlPath = req.url.split('?')[0].split('#')[0];

  // Default to index.html for root
  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1><p>Requested: ' + urlPath + '</p>');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('');
  console.log('Test pages:');
  console.log(`  http://localhost:${PORT}/              (index.html)`);
  console.log(`  http://localhost:${PORT}/test-standalone.html`);
  console.log(`  http://localhost:${PORT}/test-easyauth.html`);
  console.log(`  http://localhost:${PORT}/test-external.html`);
  console.log('');
  console.log('Press Ctrl+C to stop');
});
