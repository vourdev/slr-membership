import { getSessionIdentity } from '@/lib/session-member';
import type { CurrentMember } from '@/types/member';

/**
 * The logged-in member's identity (name / sub-tier / state) from the NextAuth
 * session, with safe defaults. `memberships/me` carries no `state`, so state stays
 * session-sourced. Consumed by the member header/sidebar and pages that need the
 * member's tier + state (dashboard, giveaways, discounts, prizes).
 */
export async function getCurrentMember(): Promise<CurrentMember> {
    const id = await getSessionIdentity();

    return {
        name: id.name ?? 'Member',
        sub_tier: id.sub_tier ?? 'VISITOR',
        state: id.state ?? '-'
    };
}
