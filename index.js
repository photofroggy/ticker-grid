import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, 'static');

process.chdir(__dirname);
process.cwd(__dirname);

import http from 'http';

const host = 'localhost',
    port = 8080,
    contentTypes = {
        '.html': "text/html",
        '.css': "text/css",
        '.js': "text/javascript",
        '.csv': "text/csv",
    };

const handler = (request, response) => {
    try {
        let requestUrl = new URL(request.url, `http://${host}:${port}`),
            pathname = requestUrl.pathname == '/' ? '/index.html' : requestUrl.pathname,
            filepath = path.join(staticPath, path.normalize(pathname)),
            contentType = contentTypes[path.extname(filepath)] ?? null,
            headers = {
                ...(contentType === null ? {} : { 'Content-Type': contentType })
            };

        let fileStream = fs.createReadStream(filepath);

        fileStream.pipe(response);

        fileStream.on('open', () => {
            response.writeHead(200, headers);
        });

        fileStream.on('error', () => {
            response.writeHead(404);
            response.end();
        });
    } catch(e) {
        response.writeHead(500);
        response.end();
        console.log(e.stack);
    }
};

const server = http.createServer(handler);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
