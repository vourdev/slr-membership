import Link from 'next/link';

import { goldButtonStyle } from '@/lib/styles';

import { ArrowRight, Lock } from 'lucide-react';

interface MembershipRequiredProps {
    /** Module name as shown in the member menu, e.g. "Prize Draws". */
    module: string;
    description: string;
}

/** Shown in place of a RED/BLUE module when a cancelled member is back on Visitor. */
export function MembershipRequired({ module, description }: MembershipRequiredProps) {
    return (
        <div className='mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <h1 className='font-bebas-neue text-3xl tracking-wide uppercase sm:text-4xl'>{module}</h1>

            <section className='bg-card-dark-navy border-slr-navy-border flex flex-col items-center rounded-2xl border px-6 py-14 text-center'>
                <span className='bg-gold-tint mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#D4AF3759]'>
                    <Lock className='text-slr-gold-label size-7' />
                </span>
                <h2 className='font-bebas-neue text-2xl tracking-wide text-white uppercase md:text-3xl'>
                    {module} is a member benefit
                </h2>
                <p className='text-slr-muted mt-2 max-w-md text-sm leading-relaxed'>{description}</p>
                <Link
                    href='/member/membership'
                    className='mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase transition-opacity hover:opacity-90'
                    style={goldButtonStyle}>
                    Resubscribe <ArrowRight className='size-4' />
                </Link>
            </section>
        </div>
    );
}
