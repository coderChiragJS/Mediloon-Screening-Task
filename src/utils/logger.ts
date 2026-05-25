import { maskReference } from './mask';

/**
 * Keys whose values must never appear in plaintext logs, on-device or in
 * any future remote sink (Sentry, Datadog, etc). The list lives here so
 * adding a new sensitive field is a one-line change.
 */
const SENSITIVE_KEYS = new Set([
  'prescriptionReference',
  'patientReference',
  'sessionId',
  'authToken',
  'refreshToken',
  'idToken',
  'password',
  'pin',
]);

function scrub(value: unknown): unknown {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(scrub);
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.has(k) && typeof v === 'string' ? maskReference(v) : scrub(v);
    }
    return out;
  }
  return value;
}

function emit(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) {
  const scrubbed = meta ? (scrub(meta) as Record<string, unknown>) : undefined;
  const prefix = `[${level.toUpperCase()}] ${message}`;
  if (level === 'error') console.error(prefix, scrubbed ?? '');
  else if (level === 'warn') console.warn(prefix, scrubbed ?? '');
  else console.log(prefix, scrubbed ?? '');
}

export const log = {
  info: (message: string, meta?: Record<string, unknown>) => emit('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit('error', message, meta),
};
