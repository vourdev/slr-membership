import type { Metadata } from 'next';

import { ComingSoon } from '../_components/coming-soon';

export const metadata: Metadata = {
    title: 'Referral · SLR Member'
};

export default function ReferralPage() {
    return (
        <ComingSoon
            title='Referral'
            description='Invite friends and earn bonus tokens. Your referral code, usage counter, bonus progress and reward history will live here soon.'
        />
    );
}
