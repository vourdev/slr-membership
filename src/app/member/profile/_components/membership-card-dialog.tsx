'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import type { SubTierCode } from '@/types/member';

import { MembershipCard } from './membership-card';
import { ChevronRight, CreditCard } from 'lucide-react';

interface MembershipCardDialogProps {
    name: string;
    subTier: SubTierCode;
    memberId: string;
    joinedAt: string;
}

export function MembershipCardDialog({ name, subTier, memberId, joinedAt }: MembershipCardDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border p-4 text-left transition-colors'>
                    <span className='bg-gold-tint flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF3759]'>
                        <CreditCard className='text-slr-gold-label size-5' />
                    </span>
                    <span className='min-w-0'>
                        <span className='block font-semibold text-white'>Membership card</span>
                        <span className='text-slr-dim block text-xs'>Tap to view your digital card &amp; QR</span>
                    </span>
                    <ChevronRight className='text-slr-dim ml-auto size-5 shrink-0' />
                </button>
            </DialogTrigger>

            {/* Portaled outside the .slr-member theme scope — style explicitly dark. */}
            <DialogContent className='border-slr-navy-border bg-slr-navy-deep text-white sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-bebas-neue text-xl tracking-wide uppercase'>
                        Membership Card
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                        Your digital SLR membership card and QR code.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex justify-center'>
                    <MembershipCard name={name} subTier={subTier} memberId={memberId} joinedAt={joinedAt} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
