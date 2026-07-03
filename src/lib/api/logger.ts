// Centralized logging for every apiFetch call. Runs on server (→ terminal) and
// client (→ browser console). Gated to dev by default; force in prod with
// NEXT_PUBLIC_API_DEBUG=true. Never logs request bodies or headers — secrets
// live there. Response/error payloads are sanitized before printing.

const REDACT_KEYS = new Set([
    'password',
    'password_confirm',
    'new_password',
    'otp_code',
    'token',
    'access_token',
    'refresh_token',
    'reset_token'
]);

const ARRAY_CAP = 5;
// Cap raw non-JSON bodies (e.g. an HTML gateway error page) so one bad response
// can't flood the log.
const STRING_CAP = 4000;

const enabled = () => process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_API_DEBUG === 'true';

// Redact secret keys, cap long arrays, and truncate huge strings so the log
// stays readable and safe.
function sanitize(value: unknown): unknown {
    if (typeof value === 'string') {
        return value.length > STRING_CAP
            ? `${value.slice(0, STRING_CAP)}…(+${value.length - STRING_CAP} chars)`
            : value;
    }

    if (Array.isArray(value)) {
        const head = value.slice(0, ARRAY_CAP).map(sanitize);

        return value.length > ARRAY_CAP
            ? [...head, `…(+${value.length - ARRAY_CAP} more, ${value.length} total)`]
            : head;
    }

    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
            out[key] = REDACT_KEYS.has(key) ? '«redacted»' : sanitize(val);
        }

        return out;
    }

    return value;
}

export interface ApiLogEntry {
    method: string;
    path: string;
    status: number;
    statusText?: string;
    message?: string;
    ms: number;
    ok: boolean;
    data?: unknown;
    error?: unknown;
}

export function logApi(entry: ApiLogEntry): void {
    if (!enabled()) return;

    const { method, path, status, statusText, message, ms, ok, data, error } = entry;
    const line = `[api] ${ok ? '✓' : '✗'} ${method} ${path}`;

    if (ok) {
        // One object so status + message + data are all visible together.
        console.log(line, { status, message, ms, data: sanitize(data) });
    } else {
        // Full error response: status/message + the complete body.
        console.error(line, { status, statusText, message, ms, response: sanitize(error) });
    }
}
