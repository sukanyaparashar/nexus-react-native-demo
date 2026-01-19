import { NexusSDK } from "@avail-project/nexus-core";

export const sdk = new NexusSDK({ network: "testnet" });

export async function initialize(provider: any) {
  if (!provider) throw new Error("Missing EIP-1193 provider");
  if (sdk.isInitialized()) return;

  await sdk.initialize(provider);
}

export async function unifiedBalances() {
  return sdk.getUnifiedBalances(false);
}

export async function bridgeUSDC() {
  return sdk.bridge({
    token: "USDC",
    amount: 1000000, // 1 USDC
    chainId: 137, // Polygon
  });
}

export async function shutdown() {
  if (!sdk.isInitialized()) return;
  await sdk.deinit();
}
