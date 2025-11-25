const express = require('express');
const http = require('http');
const WebSocket = require('ws');
// 重要：y-websocket のサーバー側ユーティリティを使う
import { setupWSConnection } from 'y-websocket/server';

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  // 接続ごとに y-websocket のプロトコル処理を紐付ける
  setupWSConnection(ws, req);
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Y-WebSocket server running at ws://localhost:${PORT}`);
});
