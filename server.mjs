import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const types = new Map([
  ['/index.html', 'text/html; charset=utf-8'], ['/styles.css', 'text/css; charset=utf-8'],
  ['/app.mjs', 'text/javascript; charset=utf-8'], ['/planner.mjs', 'text/javascript; charset=utf-8'],
  ['/storage.mjs', 'text/javascript; charset=utf-8']
]);
const port = Number(process.env.PORT || 8770);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  let pathname;
  try { pathname = new URL(req.url, 'http://localhost').pathname; } catch { res.writeHead(400); res.end(); return; }
  if (pathname === '/') pathname = '/index.html';
  if (!types.has(pathname)) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const body = await readFile(new URL(`./dist${pathname}`, import.meta.url));
    res.writeHead(200, { 'Content-Type': types.get(pathname), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Asset unavailable'); }
});
server.on('error', error => { process.stderr.write(`Preview unavailable: ${error.code || 'unknown error'}. Choose another PORT if needed.\n`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => process.stdout.write(`Spokojny Tydzień: http://127.0.0.1:${port}/\n`));
