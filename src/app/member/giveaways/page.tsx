import type { Metadata } from 'next';

import { getGiveaways } from '@/data/giveaways';
import { getCurrentMember } from '@/data/member-dashboard';

import { GiveawaysBoard } from './_components/giveaways-board';

export const metadata: Metadata = {
    title: 'Giveaways · SLR Member'
};

export default async function GiveawaysPage() {
    const member = await getCurrentMember();
    const giveaways = await getGiveaways(member.sub_tier);

    return (
        <div className='mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <header className='space-y-1'>
                <h1 className='font-bebas-neue text-3xl tracking-wide uppercase sm:text-4xl'>Giveaways</h1>
                <p className='text-slr-muted text-sm md:text-base'>
                    Active draws for your tier. Entries are allocated automatically each cycle — no manual entry needed.
                </p>
            </header>

            <GiveawaysBoard giveaways={giveaways} memberSubTier={member.sub_tier} />
        </div>
    );
}
