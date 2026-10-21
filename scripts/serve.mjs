import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const argument = process.argv.slice(2).find(value => value.startsWith('--port='));
const port = Number(argument ? argument.slice(7) : 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Use --port= with a port from 1 to 65535.');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject' };
const server = http.createServer(async (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
    try {
        const url = new URL(request.url, 'http://localhost');
        const pathname = decodeURIComponent(url.pathname);
        if (pathname.split('/').some(segment => segment.startsWith('.') || segment === 'node_modules')) throw new Error('Private path');
        let filename = path.resolve(root, '.' + pathname);
        if (filename !== root && !filename.startsWith(root + path.sep)) throw new Error('Outside site root');
        let info = await stat(filename);
        if (info.isDirectory()) {
            if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' + url.search }); response.end(); return; }
            filename = path.join(filename, 'index.html');
            info = await stat(filename);
        }
        if (!info.isFile()) throw new Error('Not a file');
        response.writeHead(200, { 'Content-Type': mime[path.extname(filename).toLowerCase()] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control': 'no-store' });
        if (request.method === 'HEAD') response.end();
        else createReadStream(filename).on('error', () => response.destroy()).pipe(response);
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Page not found.');
    }
});
server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}/`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
