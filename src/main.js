import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', ydoc);

// 複数人の操作を保持する配列
const yActions = ydoc.getArray('actions');
const myID = ydoc.clientID;

const area = document.getElementById('container');

// --- デバイス判定 ---
const ua = navigator.userAgent;
const isMobile = /Android.*Mobile|iPhone|iPod/i.test(ua);
const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
const isPC = !isMobile && !isTablet;

let myText, myDevice;
if (isMobile) {
  myText = "これはあなたのスマートフォン";
  myDevice = "smartphone";
} else if (isTablet) {
  myText = "これはあなたのタブレット";
  myDevice = "tablet";
} else if (isPC) {
  myText = "これはあなたのPC";
  myDevice = "pc";
} else {
  myText = "これはあなたのデバイス";
  myDevice = "other";
}

// --- ユーティリティ: 自分の要素を更新/削除 ---
function updateMyAction(dx, dy, active) {
  const arr = yActions.toArray();
  const index = arr.findIndex(a => a.id === myID);
  const newObj = { id: myID, device: myDevice, dx, dy, active };
  if (index >= 0) {
    yActions.delete(index, 1);
    yActions.insert(index, [newObj]);
  } else {
    yActions.push([newObj]);
  }
}

function removeMyAction() {
  const arr = yActions.toArray();
  const index = arr.findIndex(a => a.id === myID);
  if (index >= 0) {
    const old = arr[index];
    const newObj = { ...old, active: false };
    yActions.delete(index, 1);
    yActions.insert(index, [newObj]);
  }
}

// --- PCイベント ---
if (isPC) {
  area.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const dx = e.pageX - window.innerWidth / 2;
    const dy = e.pageY - window.innerHeight / 2;
    updateMyAction(dx, dy, true);
    area.setPointerCapture(e.pointerId);
  });

  area.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) { // 左クリックが押されている時だけ更新
      const dx = e.pageX - window.innerWidth / 2;
      const dy = e.pageY - window.innerHeight / 2;
      updateMyAction(dx, dy, true);
    }
  });

  area.addEventListener('pointerup', (e) => {
    removeMyAction();
    area.releasePointerCapture(e.pointerId);
  });

  // タブ外に出ても終了処理
  window.addEventListener('mouseup', () => {
    removeMyAction();
  });
  window.addEventListener('pointercancel', () => {
    removeMyAction();
  });
}

// --- スマホ／タブレットイベント ---
if (isMobile || isTablet) {
  area.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const dx = touch.pageX - window.innerWidth / 2;
    const dy = touch.pageY - window.innerHeight / 2;
    updateMyAction(dx, dy, true);
  });

  area.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const dx = touch.pageX - window.innerWidth / 2;
      const dy = touch.pageY - window.innerHeight / 2;
      updateMyAction(dx, dy, true);
    }
  });

  area.addEventListener('touchend', () => {
    removeMyAction();
  });

  // タブ外に出ても終了処理
  window.addEventListener('touchcancel', () => {
    removeMyAction();
  });
}

// --- 描画処理 ---
yActions.observe(() => {
  const actions = yActions.toArray();

  // 既存のラベルをマークしておく
  const existingLabels = {};
  document.querySelectorAll('.touchLabel').forEach(el => {
    existingLabels[el.dataset.id] = el;
  });

  actions.forEach(action => {
    if (action.active) {
      let label = existingLabels[action.id];
      if (!label) {
        // 新規作成
        label = document.createElement('div');
        label.className = 'touchLabel';
        label.dataset.id = action.id;
        // 以前は document.body.appendChild(label)
        document.getElementById('overlay').appendChild(label);
      }

      // テキスト更新
      if (action.id === myID) {
        label.textContent = myText;
      } else {
        switch (action.device) {
          case "pc": label.textContent = "これは誰かのPC"; break;
          case "smartphone": label.textContent = "これは誰かのスマートフォン"; break;
          case "tablet": label.textContent = "これは誰かのタブレット"; break;
          default: label.textContent = "これは誰かのデバイス";
        }
      }

      // 座標更新
      const drawX = Math.min(Math.max(0, window.innerWidth / 2 + action.dx), window.innerWidth);
      const drawY = Math.min(Math.max(0, window.innerHeight / 2 + action.dy), window.innerHeight);
      label.style.position = 'absolute';
      label.style.left = `${drawX}px`;
      label.style.top = `${drawY}px`;
      // label.style.fontSize = '24px';
      label.style.transform = 'translate(-50%, -50%)';
      label.style.pointerEvents = 'none';
    } else {
      // active=false の場合は削除
      const label = existingLabels[action.id];
      if (label) {
        label.remove();
      }
    }
  });
});
