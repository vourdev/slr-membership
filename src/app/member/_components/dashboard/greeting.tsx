import { TierBadge } from '@/components/common/tier-badge';
import type { CurrentMember } from '@/types/member';

import { MapPin } from 'lucide-react';

export function Greeting({ member }: { member: CurrentMember }) {
    const firstName = member.name.split(' ')[0];

    return (
        <div className='flex flex-wrap items-end justify-between gap-3'>
            <div className='space-y-1'>
                <h1 className='font-bebas-neue text-3xl leading-none tracking-wide uppercase sm:text-4xl md:text-5xl'>
                    Welcome back, <span className='text-gradient-gold'>{firstName}</span>
                </h1>
                <p className='text-slr-muted text-sm md:text-base'>Here&apos;s your membership &amp; draw summary.</p>
            </div>
            <div className='flex items-center gap-2'>
                <TierBadge subTier={member.sub_tier} />
                <span className='text-slr-dim inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/3 px-2.5 py-1 text-xs font-medium'>
                    <MapPin className='size-3.5' /> {member.state}
                </span>
            </div>
        </div>
    );
}
