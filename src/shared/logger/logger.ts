import { environmentManager } from "../config";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Readonly<{
  module: string;
  operation?: string;
  metadata?: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type LoggerProvider = {
  log: (level: LogLevel, message: string, context: LogContext) => void;
};

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function minimumLevel(): LogLevel {
  if (environmentManager.isProduction()) {
    return "warn";
  }

  if (environmentManager.isPreview()) {
    return "info";
  }

  return "debug";
}

const consoleLoggerProvider: LoggerProvider = {
  log: (level, message, context) => {
    if (levelPriority[level] < levelPriority[minimumLevel()]) {
      return;
    }

    const entry = {
      level,
      message,
      module: context.module,
      operation: context.operation,
      metadata: context.metadata,
      timestamp: new Date().toISOString()
    };

    console[level === "debug" ? "debug" : level](entry);
  }
};

let activeProvider: LoggerProvider = consoleLoggerProvider;

export function setLoggerProvider(provider: LoggerProvider): void {
  activeProvider = provider;
}

export const logger = {
  debug: (message: string, context: LogContext): void =>
    activeProvider.log("debug", message, context),
  info: (message: string, context: LogContext): void =>
    activeProvider.log("info", message, context),
  warn: (message: string, context: LogContext): void =>
    activeProvider.log("warn", message, context),
  error: (message: string, context: LogContext): void =>
    activeProvider.log("error", message, context)
} as const;
