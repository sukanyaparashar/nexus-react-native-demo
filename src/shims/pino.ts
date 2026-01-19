type LogFn = (...args: any[]) => void;

function createLogger() {
  const log: LogFn = (...args) => console.log(...args);
  const noop: LogFn = () => {};

  // mimic pino-like API shape enough for most libs
  return {
    level: "info",
    child: () => createLogger(),
    info: log,
    debug: log,
    warn: log,
    error: log,
    fatal: log,
    trace: noop,
  };
}

export default function pino() {
  return createLogger();
}
