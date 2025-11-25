// server.js (ESM形式)
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils.js'; // 古いバージョンなら利用可能

const app = express();
app.get('/', (req, res) => {
  res.send('Y-WebSocket server is running');
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