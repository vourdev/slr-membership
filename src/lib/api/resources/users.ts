import type { AuStateCode } from '@/constant/au-states';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// PATCH /users/{id} — admin user update. Used for the member's geographic `state`
// (the draw-pool state half; tier/sub-tier goes through /memberships/change-tier).
// Verified: PATCH { state: "NSW" } → 200 "User updated.", persists.
export interface UserUpdatePayload {
    state?: AuStateCode;
}

export interface AdminUserRecord {
    id?: string;
    state?: string | null;
}

export const updateUser = (userId: string, body: UserUpdatePayload, token: string) =>
    apiFetch<AdminUserRecord>(API.users.update(userId), { method: 'PATCH', body, token });
