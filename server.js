// server.js (ESM形式)
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vite のビルド結果 (dist フォルダ) を静的配信
app.use(express.static(path.join(__dirname, 'dist')));

// ルートで index.html を返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req);
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// // server.js (ESM形式)
// import express from 'express';
// import http from 'http';
// import { WebSocketServer } from 'ws';
// // import { setupWSConnection } from 'y-websocket/bin/utils.js'; // 古いバージョンなら利用可能
// import { setupWSConnection } from 'y-websocket/server';

// const app = express();
// app.get('/', (req, res) => {
//   res.send('Y-WebSocket server is running');
// });

// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// wss.on('connection', (conn, req) => {
//   setupWSConnection(conn, req);
// });

// const PORT = process.env.PORT || 1234;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });