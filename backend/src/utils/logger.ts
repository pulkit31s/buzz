/**
 * Standard utility for structured logging across controllers, services, and middlewares.
 * Replaces ad-hoc console.logs with clean level-based formatting.
 */
export const logger = {
  info: (message: string, ...meta: any[]) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`, meta.length ? meta : "");
  },
  warn: (message: string, ...meta: any[]) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${message}`, meta.length ? meta : "");
  },
  error: (message: string, ...meta: any[]) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`, meta.length ? meta : "");
  },
  debug: (message: string, ...meta: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      const timestamp = new Date().toISOString();
      console.debug(`[DEBUG] [${timestamp}] ${message}`, meta.length ? meta : "");
    }
  },
};
