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
  const sdk = useMemo(
    () =>
      new NexusSDK({
        network: "testnet",
        siweParams: {
          scheme: "https",
          origin: "https://google.com",
          domain: "google.com",
        },
      }),
    [],
  );
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
    return sdk.getBalancesForBridge();
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

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useRef,
//   useState,
//   type PropsWithChildren,
// } from "react";

// type NexusSdkLike = any; // keep as any to avoid import-time crash

// type NexusContextValue = {
//   sdk: NexusSdkLike | null;
//   isInitialized: boolean;
//   initialize: (provider: any) => Promise<void>;
//   getUnifiedBalances: () => Promise<any>;
// };

// const NexusContext = createContext<NexusContextValue | null>(null);

// export function NexusProvider({ children }: PropsWithChildren) {
//   const sdkRef = useRef<NexusSdkLike | null>(null);
//   const initializingRef = useRef<Promise<void> | null>(null);

//   const [isInitialized, setIsInitialized] = useState(false);

//   const getSdk = useCallback(async () => {
//     // Prevent RN from crashing on import/constructor
//     /*if (Platform.OS !== "web") {
//       throw new Error(
//         "Nexus Core SDK is currently web-only (requires relayer + browser APIs). Use web build or WebView, or skip Nexus in native.",
//       );
//     }*/

//     if (sdkRef.current) return sdkRef.current;

//     // Dynamic import so it never loads at bundle init time
//     const mod = await import("@avail-project/nexus-core");
//     const NexusSDK = (mod as any).NexusSDK;

//     if (!NexusSDK) {
//       throw new Error("NexusSDK export not found in @avail-project/nexus-core");
//     }

//     sdkRef.current = new NexusSDK({ network: "mainnet" });
//     return sdkRef.current;
//   }, []);

//   const initialize = useCallback(
//     async (provider: any) => {
//       if (isInitialized) return;

//       // de-dupe concurrent clicks
//       if (initializingRef.current) return initializingRef.current;

//       initializingRef.current = (async () => {
//         const sdk = await getSdk();
//         await sdk.initialize({ provider });
//         setIsInitialized(true);
//       })();

//       try {
//         await initializingRef.current;
//       } finally {
//         initializingRef.current = null;
//       }
//     },
//     [getSdk, isInitialized],
//   );

//   const getUnifiedBalances = useCallback(async () => {
//     if (!isInitialized) throw new Error("SDK not initialized");
//     const sdk = await getSdk();
//     return await sdk.getBalancesForBridge();
//   }, [getSdk, isInitialized]);

//   return (
//     <NexusContext.Provider
//       value={{
//         sdk: sdkRef.current,
//         isInitialized,
//         initialize,
//         getUnifiedBalances,
//       }}
//     >
//       {children}
//     </NexusContext.Provider>
//   );
// }

// export function useNexus() {
//   const ctx = useContext(NexusContext);
//   if (!ctx) throw new Error("useNexus must be used within NexusProvider");
//   return ctx;
// }
