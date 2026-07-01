import Image from 'next/image';

import { TierBadge } from '@/components/common/tier-badge';
import { TIER_VISUALS } from '@/constant/tiers';
import { formatShortDate, tierGroupOf } from '@/lib/member';
import type { SubTierCode } from '@/types/member';

import { QRCodeSVG } from 'qrcode.react';

interface MembershipCardProps {
    name: string;
    subTier: SubTierCode;
    memberId: string;
    joinedAt: string;
}

export function MembershipCard({ name, subTier, memberId, joinedAt }: MembershipCardProps) {
    const visual = TIER_VISUALS[tierGroupOf(subTier)];

    return (
        <div
            className='shadow-card-warm relative isolate flex aspect-8/5 w-full max-w-sm flex-col justify-between overflow-hidden rounded-2xl border p-5'
            style={{ background: visual.badgeBg, borderColor: visual.badgeBorder }}>
            {/* light sheen for depth */}
            <div className='pointer-events-none absolute -top-14 -right-14 -z-10 size-44 rounded-full bg-white/10 blur-3xl' />

            {/* top — brand + tier */}
            <div className='flex items-start justify-between gap-2'>
                <Image
                    src='/images/slr-rewards-logo.webp'
                    alt='SLR Rewards'
                    width={250}
                    height={250}
                    className='h-7 w-auto object-contain'
                />
                <TierBadge subTier={subTier} />
            </div>

            {/* bottom — member details + QR */}
            <div className='flex items-end justify-between gap-3'>
                <div className='min-w-0'>
                    <p className='text-slr-dim text-xs tracking-widest uppercase'>Member</p>
                    <p className='font-bebas-neue truncate text-2xl tracking-wide text-white uppercase md:text-3xl'>
                        {name}
                    </p>
                    <p className='text-slr-muted mt-1 font-mono text-xs tracking-wider'>{memberId}</p>
                    <p className='text-slr-dim mt-1.5 text-xs'>Member since {formatShortDate(joinedAt)}</p>
                </div>
                <div className='shrink-0 rounded-lg bg-white p-2'>
                    <QRCodeSVG
                        value={memberId}
                        size={60}
                        bgColor='#ffffff'
                        fgColor='#0a0a0a'
                        level='M'
                        marginSize={0}
                    />
                </div>
            </div>
        </div>
    );
}
