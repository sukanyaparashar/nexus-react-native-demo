const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { resolve } = require("metro-resolver");

const config = getDefaultConfig(__dirname);

const emptyShim = path.resolve(__dirname, "src/shims/empty.ts");
const cryptoShim = path.resolve(__dirname, "src/shims/crypto.js");
const posthogShim = path.resolve(__dirname, "src/shims/posthog.js");

// Prefer react-native, then browser builds over Node.js "main"
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Node crypto → RN crypto shim (for nexus-core)
  // if (moduleName === "crypto" || moduleName === "node:crypto") {
  //   return { type: "sourceFile", filePath: cryptoShim };
  // }

  // libsodium requires WebAssembly - not available in Expo Go
  if (
    moduleName === "libsodium-sumo" ||
    moduleName.startsWith("libsodium-sumo/") ||
    moduleName === "libsodium-wrappers-sumo" ||
    moduleName.startsWith("libsodium-wrappers-sumo/")
  ) {
    return { type: "sourceFile", filePath: emptyShim };
  }

  // PostHog expects browser APIs - use stub shim

  return resolve(context, moduleName, platform);
};

module.exports = config;
