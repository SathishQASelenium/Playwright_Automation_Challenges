/**
 * Minimal static server for the integration frontend.
 *
 * It intentionally has no dependencies: Playwright starts it through
 * `webServer` in playwright.config.ts and the page then talks to
 * https://jsonplaceholder.typicode.com directly from the browser.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const host = process.env.FRONTEND_HOST ?? '127.0.0.1';
const port = Number(process.env.FRONTEND_PORT ?? 4173);
const root = __dirname;

const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${host}:${port}`);

    if (url.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    if (url.pathname === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = path.join(root, decodeURIComponent(requestedPath));

    if (!filePath.startsWith(root)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentTypes[path.extname(filePath)] ?? 'application/octet-stream',
            'Cache-Control': 'no-store',
        });
        res.end(data);
    });
});

server.listen(port, host, () => {
    console.log(`Frontend harness running at http://${host}:${port}`);
});

function shutdown() {
    server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
