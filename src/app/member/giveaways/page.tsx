import type { Metadata } from 'next';

import EmptyState from '@/components/common/empty-state';
import { getCurrentMember } from '@/data/member-dashboard';
import { handleApiAuthError } from '@/lib/api/guard';
import { getGiveaways, toGiveaway } from '@/lib/api/resources/giveaways';
import { getAccessToken } from '@/lib/api/server';
import { tierGroupOf } from '@/lib/member';
import type { Giveaway } from '@/types/member';

import { GiveawaysBoard } from './_components/giveaways-board';
import { Gift } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Giveaways · SLR Member'
};

export default async function GiveawaysPage() {
    const member = await getCurrentMember();
    const token = await getAccessToken();
    const memberGroup = tierGroupOf(member.sub_tier);

    let giveaways: Giveaway[] = [];
    let failed = false;

    if (token) {
        try {
            const list = await getGiveaways(token);
            giveaways = list.map((g) => toGiveaway(g, memberGroup, member.state));
        } catch (error) {
            handleApiAuthError(error); // expired session → force logout
            failed = true;
        }
    }

    return (
        <div className='mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <header className='space-y-1'>
                <h1 className='font-bebas-neue text-3xl tracking-wide uppercase sm:text-4xl'>Giveaways</h1>
                <p className='text-slr-muted text-sm md:text-base'>
                    Active draws for your tier. Entries are allocated automatically each cycle — no manual entry needed.
                </p>
            </header>

            {failed || giveaways.length === 0 ? (
                <EmptyState
                    icon={Gift}
                    title='No Giveaways Right Now'
                    description='Active draws for your tier will appear here soon.'
                />
            ) : (
                <GiveawaysBoard giveaways={giveaways} memberSubTier={member.sub_tier} />
            )}
        </div>
    );
}
