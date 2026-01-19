import { NexusSDK } from "@avail-project/nexus-core";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useRef, useState } from "react";

type NexusCtx = {
  sdk: NexusSDK;
  isInitialized: boolean;
  initialize: (provider: any) => Promise<void>;
  getUnifiedBalances: () => Promise<any>;
  deinit: () => Promise<void>;
};

const Ctx = createContext<NexusCtx | null>(null);

export function NexusProvider({ children }: PropsWithChildren) {
  // One SDK instance for the whole app
  const sdk = useMemo(() => new NexusSDK({ network: "testnet" }), []);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializingRef = useRef<Promise<void> | null>(null);

  const initialize = async (provider: any) => {
    if (!provider) throw new Error("Missing EIP-1193 provider");
    if (sdk.isInitialized()) {
      setIsInitialized(true);
      return;
    }
    // prevent double-inits if user taps twice
    if (!initializingRef.current) {
      initializingRef.current = (async () => {
        await sdk.initialize(provider);
        setIsInitialized(true);
      })().finally(() => {
        initializingRef.current = null;
      });
    }
    return initializingRef.current;
  };

  const getUnifiedBalances = async () => {
    if (!sdk.isInitialized()) throw new Error("Nexus SDK not initialized");
    return sdk.getUnifiedBalances(false);
  };

  const deinit = async () => {
    if (!sdk.isInitialized()) return;
    await sdk.deinit();
    setIsInitialized(false);
  };

  const value: NexusCtx = {
    sdk,
    isInitialized,
    initialize,
    getUnifiedBalances,
    deinit,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNexus() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNexus must be used within <NexusProvider />");
  return v;
}
