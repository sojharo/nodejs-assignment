type LogLevel = 'info' | 'warn' | 'error' | 'debug';

type LogMeta = Record<string, unknown>;

function formatMessage(
    level: LogLevel,
    message: string,
    meta?: LogMeta
): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | meta=${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
}

// TODO: Use bunyan or winston for logging

export function logInfo(message: string, meta?: LogMeta) {
    console.log(formatMessage('info', message, meta));
}

export function logWarn(message: string, meta?: LogMeta) {
    console.warn(formatMessage('warn', message, meta));
}

export function logError(message: string, meta?: LogMeta) {
    console.error(formatMessage('error', message, meta));
}

export function logDebug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== 'production') {
        console.debug(formatMessage('debug', message, meta));
    }
}
