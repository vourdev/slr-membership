import type { Metadata } from 'next';

import { ComingSoon } from '../_components/coming-soon';

export const metadata: Metadata = {
    title: 'Entry History · SLR Member'
};

export default function EntryHistoryPage() {
    return (
        <ComingSoon
            title='Entry History'
            description='Your per-cycle entry history — tokens, referral bonus, tier changes and entry status — will be available here soon.'
        />
    );
}
