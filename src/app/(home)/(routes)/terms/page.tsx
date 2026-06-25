import { Metadata } from 'next';

import LegalDoc, { LegalSection } from '../_components/legal-doc';
import PageHero from '../_components/page-hero';

export const metadata: Metadata = {
    title: 'Terms & Conditions · SLR Rewards',
    description: 'The terms that apply when you use Smart Life Rewards.'
};

const sections: LegalSection[] = [
    {
        heading: 'Acceptance of terms',
        body: (
            <p>
                By creating an account or using the Smart Life Rewards (SLR) website, mobile app, or related services
                (the &ldquo;Services&rdquo;), you agree to be bound by these Terms &amp; Conditions. If you do not
                agree, please do not use the Services.
            </p>
        )
    },
    {
        heading: 'Eligibility',
        body: (
            <p>
                You must be 18 years of age or older and a permanent resident of Australia to register as a member. When
                you sign up, the information you provide — including your full name, email, password, state or
                territory, and phone number — must be accurate and kept up to date.
            </p>
        )
    },
    {
        heading: 'Membership tiers and billing',
        body: (
            <>
                <p>
                    SLR offers a free Visitor tier and paid tiers (SLR Red and SLR Premium / Blue) billed monthly
                    through Stripe. Pricing for each tier is shown during registration and on the pricing section of our
                    website.
                </p>
                <p>
                    Paid subscriptions automatically renew each month until cancelled. You may cancel at any time from
                    your account; access continues until the end of the current billing cycle. Refunds are not provided
                    for partial months except where required by Australian Consumer Law.
                </p>
            </>
        )
    },
    {
        heading: 'Prize draws',
        body: (
            <>
                <p>
                    Prize entries are assigned automatically based on your tier and only after a successful monthly
                    payment. Entries do not accumulate between cycles and are valid only for the active draw cycle.
                </p>
                <p>
                    Draws are conducted by TPAL, an independent authorised provider, under the relevant state and
                    territory permit conditions. Full giveaway rules are published on the Giveaway Rules page.
                </p>
            </>
        )
    },
    {
        heading: 'Discounts and BENY',
        body: (
            <p>
                Partner discounts are provided by third parties. SLR does not warrant the availability, price, or
                quality of any partner offer. The BENY discount platform is an optional add-on ($5/month extra) and is
                operated by a third party; activation requires a phone number and is subject to BENY&rsquo;s own terms.
            </p>
        )
    },
    {
        heading: 'Acceptable use',
        body: (
            <>
                <p>You agree not to:</p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>Create more than one account or impersonate another person</li>
                    <li>Share, resell, or commercialise discount codes or e-book content</li>
                    <li>Attempt to bypass tier restrictions or manipulate entries</li>
                    <li>Interfere with the security or operation of the Services</li>
                </ul>
                <p>SLR may suspend or terminate accounts that breach these conditions.</p>
            </>
        )
    },
    {
        heading: 'Intellectual property',
        body: (
            <p>
                All content on the SLR platform — including logos, designs, copy, e-books, and software — is owned by
                Smart Life Rewards Pty Ltd or its licensors and is protected by Australian and international copyright
                laws. You may not reproduce or distribute any content without prior written permission.
            </p>
        )
    },
    {
        heading: 'Liability',
        body: (
            <p>
                To the maximum extent permitted by law, SLR&rsquo;s liability for any loss arising from your use of the
                Services is limited to the amount of fees you have paid in the 12 months preceding the claim. Nothing in
                these terms limits your rights under the Australian Consumer Law.
            </p>
        )
    },
    {
        heading: 'Changes to these terms',
        body: (
            <p>
                We may update these Terms &amp; Conditions from time to time. Material changes will be communicated by
                email and posted on this page with a new &ldquo;Last updated&rdquo; date. Continued use of the Services
                after changes take effect constitutes acceptance.
            </p>
        )
    },
    {
        heading: 'Governing law',
        body: (
            <p>
                These terms are governed by the laws of Victoria, Australia. Any dispute will be subject to the
                non-exclusive jurisdiction of the courts of Victoria.
            </p>
        )
    }
];

const TermsPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Legal'
                title='Terms & Conditions'
                description='Please read these terms carefully before using Smart Life Rewards.'
            />
            <LegalDoc
                lastUpdated='15 May 2026'
                intro={
                    <p>
                        These Terms &amp; Conditions govern your access to and use of Smart Life Rewards. By creating an
                        account you agree to be bound by them.
                    </p>
                }
                sections={sections}
            />
        </>
    );
};

export default TermsPage;
