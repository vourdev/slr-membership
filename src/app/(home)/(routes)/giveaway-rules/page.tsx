import { Metadata } from 'next';

import LegalDoc, { LegalSection } from '../_components/legal-doc';
import PageHero from '../_components/page-hero';

export const metadata: Metadata = {
    title: 'Giveaway Rules · SLR Rewards',
    description: 'The rules that apply to all Smart Life Rewards prize draws and giveaways.'
};

const sections: LegalSection[] = [
    {
        heading: 'The promoter',
        body: (
            <p>
                All prize draws (&ldquo;Draws&rdquo;) on Smart Life Rewards are promoted by Smart Life Rewards Pty Ltd
                (&ldquo;SLR&rdquo;). Draws are conducted in conjunction with TPAL, an independent authorised provider,
                under the relevant state and territory permit conditions.
            </p>
        )
    },
    {
        heading: 'Eligibility',
        body: (
            <>
                <p>To be eligible to enter a draw, you must:</p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>Be 18 years of age or older</li>
                    <li>Be a permanent resident of Australia</li>
                    <li>Hold an active SLR account that matches the tier of the draw</li>
                    <li>For paid-tier draws, have an active monthly subscription with a successful payment</li>
                </ul>
                <p>Employees of SLR, TPAL, and their immediate family members are not eligible to win.</p>
            </>
        )
    },
    {
        heading: 'How entries are allocated',
        body: (
            <>
                <p>
                    Entries are calculated automatically by the SLR platform based on your membership tier and assigned
                    only after a successful monthly Stripe payment.
                </p>
                <p>
                    Entries are <strong>not cumulative</strong>. They are valid only for the current draw cycle and
                    reset at the end of each cycle. If a payment fails, no new entries are assigned for that cycle.
                </p>
            </>
        )
    },
    {
        heading: 'Draw pools',
        body: (
            <p>
                Each member belongs to one draw pool determined by their state or territory and tier (for example,
                &ldquo;SLR Red VIC&rdquo; or &ldquo;SLR Blue NSW&rdquo;). Winners are selected from within each pool.
                State cannot be changed after registration without admin approval.
            </p>
        )
    },
    {
        heading: 'Draw process',
        body: (
            <>
                <p>At the close of a draw cycle:</p>
                <ol className='ml-5 list-decimal space-y-1'>
                    <li>SLR generates a TPAL-compliant data export for each tier</li>
                    <li>TPAL processes the data and randomly selects winners under permit conditions</li>
                    <li>Winners are notified by email and SMS</li>
                    <li>Winners are excluded from any remaining draws in the same cycle</li>
                    <li>Entries reset and the next cycle begins</li>
                </ol>
            </>
        )
    },
    {
        heading: 'Prizes',
        body: (
            <>
                <p>
                    Prizes for each draw are described on the relevant draw page. Prize values are correct at the time
                    of publication. SLR reserves the right to substitute a prize of equal or greater value if a specific
                    prize becomes unavailable.
                </p>
                <p>
                    Prizes are awarded directly to the winner (cash credits, gift cards, or physical items) — SLR does
                    not operate a wallet system that you need to claim from. Prizes are not transferable and cannot be
                    exchanged for cash unless stated.
                </p>
            </>
        )
    },
    {
        heading: 'Spin Wheel',
        body: (
            <>
                <p>
                    Paid-tier members receive one Spin Wheel attempt per draw cycle. The wheel outcome is randomly
                    generated and may include:
                </p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>Bonus entries added to your current cycle</li>
                    <li>Discount credit toward partner offers</li>
                    <li>A percentage discount applied to your next Stripe invoice</li>
                    <li>No prize</li>
                </ul>
                <p>The wheel resets at the start of each new cycle. Spins cannot be transferred or carried over.</p>
            </>
        )
    },
    {
        heading: 'Winner verification and forfeiture',
        body: (
            <p>
                SLR may require winners to verify their identity and eligibility before a prize is released. If a winner
                cannot be contacted within 30 days, fails verification, or is found to be ineligible, the prize may be
                forfeited and a re-draw conducted under permit conditions.
            </p>
        )
    },
    {
        heading: 'Privacy',
        body: (
            <p>
                Entry data shared with TPAL (name, email, state, entry count, tier) is used solely for the purpose of
                conducting the draw and verifying winners. See our{' '}
                <a href='/privacy' className='text-[#FFDC75] hover:underline'>
                    Privacy Policy
                </a>{' '}
                for more.
            </p>
        )
    },
    {
        heading: 'Changes',
        body: (
            <p>
                SLR may update these giveaway rules from time to time. Material changes will be communicated by email
                and posted on this page with a new &ldquo;Last updated&rdquo; date.
            </p>
        )
    }
];

const GiveawayRulesPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Legal'
                title='Giveaway Rules'
                description='How SLR prize draws, entries, and the Spin Wheel work — and the conditions that apply.'
            />
            <LegalDoc
                lastUpdated='15 May 2026'
                intro={
                    <p>
                        These rules apply to all prize draws, giveaways, and Spin Wheel outcomes operated by Smart Life
                        Rewards. By participating you agree to be bound by them.
                    </p>
                }
                sections={sections}
            />
        </>
    );
};

export default GiveawayRulesPage;
