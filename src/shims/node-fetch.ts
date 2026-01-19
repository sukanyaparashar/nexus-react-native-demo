// node-fetch shim for React Native / Expo
// Many libs expect: import fetch from "node-fetch"
export default function fetchShim(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  return fetch(input as any, init as any);
}

// Some libs call named exports too; provide minimal compatibility
export const Headers = globalThis.Headers;
export const Request = globalThis.Request;
export const Response = globalThis.Response;
export const FetchError = Error;
