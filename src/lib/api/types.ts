// Shared API primitives for the SLR REST backend (https://api.smartliferewards.com.au).
// Every endpoint returns this envelope; unwrap to the typed `data` payload.

export interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, unknown>;
}

/** Thrown by `apiFetch` on a transport error or a `success: false` envelope. */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public payload?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}
