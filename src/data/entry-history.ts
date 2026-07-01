import type { EntryHistoryEntry } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock entry history (PRD §"Entry History Page"), newest cycle first. Demo
// member is an SLR RED (R4) who upgraded over time: Visitor → R1 → R4, with one
// inactive cycle (a previous win reset the paid draw_pass to 0). Current cycle
// total = 4, matching the dashboard's "Entries per draw". Swap for the API later.
// ─────────────────────────────────────────────────────────────────────────────

const ENTRIES: EntryHistoryEntry[] = [
    {
        id: 'c12',
        cycle_label: 'Cycle 12',
        cycle_range: '5 Jun – 3 Jul 2026',
        sub_tier: 'R4',
        base_tokens: 4,
        referral_bonus: 0,
        total_tokens: 4,
        entry_status: 'active',
        tier_change: null
    },
    {
        id: 'c11',
        cycle_label: 'Cycle 11',
        cycle_range: '8 May – 5 Jun 2026',
        sub_tier: 'R4',
        base_tokens: 4,
        referral_bonus: 3, // PRD: flat +3 token bonus (RED/BLUE) when 10 referrals hit
        total_tokens: 7,
        entry_status: 'active',
        tier_change: 'upgrade',
        changed_from: 'R1'
    },
    {
        id: 'c10',
        cycle_label: 'Cycle 10',
        cycle_range: '10 Apr – 8 May 2026',
        sub_tier: 'R1',
        base_tokens: 1,
        referral_bonus: 0,
        total_tokens: 1,
        entry_status: 'inactive',
        inactive_reason: 'Previous winner — draw entries reset for the cycle',
        tier_change: null
    },
    {
        id: 'c9',
        cycle_label: 'Cycle 9',
        cycle_range: '13 Mar – 10 Apr 2026',
        sub_tier: 'R1',
        base_tokens: 1,
        referral_bonus: 0,
        total_tokens: 1,
        entry_status: 'active',
        tier_change: 'upgrade',
        changed_from: 'VISITOR'
    },
    {
        id: 'c8',
        cycle_label: 'Cycle 8',
        cycle_range: '13 Feb – 13 Mar 2026',
        sub_tier: 'VISITOR',
        base_tokens: 1,
        referral_bonus: 0,
        total_tokens: 1,
        entry_status: 'active',
        tier_change: null
    }
];

export async function getEntryHistory(): Promise<EntryHistoryEntry[]> {
    return ENTRIES;
}
