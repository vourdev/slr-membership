import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';
import type { PresignedUrlResponse } from './ebooks';

/** Shape mirrored off live api-dev responses (2026-09-15). Reads are snake_case. */
export interface PartnerLogo {
    partner_id: string;
    name: string;
    logo_url: string;
    website_url: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/** Writes are camelCase. name needs 2+ characters; logoUrl is required. */
export interface PartnerLogoPayload {
    name: string;
    logoUrl: string;
    websiteUrl: string | null;
    sortOrder: number;
    isActive: boolean;
}

export const comparePartnerLogos = (a: PartnerLogo, b: PartnerLogo): number =>
    a.sort_order - b.sort_order || a.name.localeCompare(b.name);

/** Public, active-only list for the homepage. The API defaults to 20 per page. */
export const getPublicPartnerLogos = cache(() =>
    apiFetch<PartnerLogo[]>(`${API.partnerLogos.public}?page=1&per_page=100`, { revalidate: 300 })
);

export const getAdminPartnerLogos = cache((token: string) =>
    apiFetch<PartnerLogo[]>(`${API.partnerLogos.adminList}?page=1&per_page=100`, { token, cache: 'no-store' })
);

export const getAdminPartnerLogo = cache((id: string, token: string) =>
    apiFetch<PartnerLogo>(API.partnerLogos.adminDetail(id), { token, cache: 'no-store' })
);

export const createPartnerLogo = (token: string, payload: PartnerLogoPayload) =>
    apiFetch<PartnerLogo>(API.partnerLogos.adminList, { method: 'POST', token, body: payload });

/** PATCH merges, so the form can send the full object without resetting anything. */
export const updatePartnerLogo = (token: string, id: string, payload: PartnerLogoPayload) =>
    apiFetch<PartnerLogo>(API.partnerLogos.adminDetail(id), { method: 'PATCH', token, body: payload });

export const deletePartnerLogo = (token: string, id: string) =>
    apiFetch<null>(API.partnerLogos.adminDetail(id), { method: 'DELETE', token });

export const getPartnerLogoPresignedUrl = (
    token: string,
    body: { filename: string; contentType: string; fileSize: number }
) => apiFetch<PresignedUrlResponse>(API.partnerLogos.presignedUrl, { method: 'POST', token, body });
