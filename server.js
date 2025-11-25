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

// import express from 'express';
// import http from 'http';
// import WebSocket from 'ws';
// import { setupWSConnection } from 'y-websocket/bin/utils.js';

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Y-WebSocket server is running');
// });

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws, req) => {
//   setupWSConnection(ws, req);
// });

// const PORT = process.env.PORT || 1234;
// server.listen(PORT, () => {
//   console.log(`Y-WebSocket server running at ws://localhost:${PORT}`);
// });


// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// // 重要：y-websocket のサーバー側ユーティリティを使う
// import { setupWSConnection } from 'y-websocket/server';

// const app = express();
// const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws, req) => {
//   // 接続ごとに y-websocket のプロトコル処理を紐付ける
//   setupWSConnection(ws, req);
// });

// const PORT = process.env.PORT || 1234;
// server.listen(PORT, () => {
//   console.log(`Y-WebSocket server running at ws://localhost:${PORT}`);
// });
