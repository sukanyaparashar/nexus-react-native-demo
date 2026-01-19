const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { resolve } = require("metro-resolver");

const config = getDefaultConfig(__dirname);

const pinoShim = path.resolve(__dirname, "src/shims/pino.ts");
const nodeFetchShim = path.resolve(__dirname, "src/shims/node-fetch.ts");
const wsShim = path.resolve(__dirname, "src/shims/ws.ts");
const emptyShim = path.resolve(__dirname, "src/shims/empty.ts");
const eventsShim = path.resolve(__dirname, "src/shims/events.ts");

// Optional but helps: avoid preferring .mjs when possible
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (e) => e !== "mjs"
);
config.resolver.resolverMainFields = ["react-native", "main", "browser"];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // ---- WalletConnect logger pulls node "pino" ----
  if (moduleName === "pino" || moduleName === "pino/browser") {
    return { type: "sourceFile", filePath: pinoShim };
  }
  if (moduleName === "pino-pretty") {
    return { type: "sourceFile", filePath: emptyShim };
  }

  // ---- Some deps pull node-fetch (node-only) ----
  if (moduleName === "node-fetch") {
    return { type: "sourceFile", filePath: nodeFetchShim };
  }

  // ---- Fuel SDK breaks RN bundling (reserved export "Commands") ----
  // If anything imports "fuels", no-op it in RN.
  if (moduleName === "fuels") {
    return { type: "sourceFile", filePath: emptyShim };
  }

  // Safety: if any deep import happens, no-op those too
  if (moduleName.startsWith("fuels/")) {
    return { type: "sourceFile", filePath: emptyShim };
  }

  // ✅ Node ws → RN WebSocket
  if (moduleName === "ws") {
    return { type: "sourceFile", filePath: wsShim };
  }
  if (moduleName.startsWith("ws/")) {
    return { type: "sourceFile", filePath: wsShim };
  }

  if (moduleName === "events") {
    return { type: "sourceFile", filePath: eventsShim };
  }

  // (Optional) If your tree imports fuel-ts packages directly, uncomment:
  // if (moduleName.startsWith("@fuel-ts/")) {
  //   return { type: "sourceFile", filePath: emptyShim };
  // }

  return resolve(context, moduleName, platform);
};

module.exports = config;
