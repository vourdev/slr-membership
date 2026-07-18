import { UpgradeTierButtons } from './upgrade-tier-buttons';

interface ManageTierProps {
    isVisitor: boolean;
}

// Visitor → Stripe checkout (live). Paid → paid change / cancel is Ronde 3;
// shown disabled until POST /memberships/upgrade + cancel are wired.
export function ManageTier({ isVisitor }: ManageTierProps) {
    return (
        <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>
                Manage Membership
            </h2>

            {isVisitor ? (
                <div className='mt-4'>
                    <p className='text-slr-muted mb-3 text-sm'>
                        Upgrade to unlock member draws, partner discounts and e-books. You’ll be taken to Stripe’s
                        secure checkout — no charge until you confirm.
                    </p>
                    <UpgradeTierButtons />
                </div>
            ) : (
                <div className='mt-4 space-y-3'>
                    <div className='flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/3 p-4'>
                        <span className='text-sm text-white/90'>Change plan (upgrade / downgrade)</span>
                        <span className='text-slr-dim rounded-md border border-white/10 px-2 py-1 text-xs'>
                            Coming soon
                        </span>
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/3 p-4'>
                        <span className='text-sm text-white/90'>Cancel membership</span>
                        <span className='text-slr-dim rounded-md border border-white/10 px-2 py-1 text-xs'>
                            Coming soon
                        </span>
                    </div>
                    <p className='text-slr-dim text-xs'>
                        Plan changes and cancellation open in a later release. Use Manage Billing to update your card.
                    </p>
                </div>
            )}
        </section>
    );
}
