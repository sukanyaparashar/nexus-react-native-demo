// Minimal 'ws' shim for React Native / Expo.
// Many libs do: const WebSocket = require('ws') or import WebSocket from 'ws'
export default globalThis.WebSocket as any;

// Common named exports in ws ecosystem (best-effort)
export const WebSocket = globalThis.WebSocket as any;
