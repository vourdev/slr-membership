import { Metadata } from 'next';

import LegalDoc, { LegalSection } from '../_components/legal-doc';
import PageHero from '../_components/page-hero';

export const metadata: Metadata = {
    title: 'Privacy Policy · SLR Rewards',
    description: 'How Smart Life Rewards collects, uses, and protects your personal information.'
};

const sections: LegalSection[] = [
    {
        heading: 'What information we collect',
        body: (
            <>
                <p>When you register and use SLR, we collect:</p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>Account details: full name, email, password, phone number, state or territory</li>
                    <li>Membership and billing data: tier, subscription status, payment history (handled by Stripe)</li>
                    <li>Activity data: draws entered, spin-wheel results, discounts viewed, e-books opened</li>
                    <li>Technical data: IP address, device, browser, and basic analytics</li>
                </ul>
                <p>
                    We do <strong>not</strong> store full credit-card numbers — all payment details are handled directly
                    by Stripe, a PCI-DSS Level 1 compliant provider.
                </p>
            </>
        )
    },
    {
        heading: 'How we use your information',
        body: (
            <>
                <p>We use your information to:</p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>Operate your membership, process payments, and allocate prize entries</li>
                    <li>Send transactional emails and SMS (welcome, OTP, draw reminders, results, billing)</li>
                    <li>Provide partner discounts and respond to your support requests</li>
                    <li>Improve the platform through aggregate analytics</li>
                    <li>Meet our legal obligations under Australian permit conditions</li>
                </ul>
            </>
        )
    },
    {
        heading: 'Who we share information with',
        body: (
            <>
                <p>SLR shares limited data with the following parties, only for the purposes shown:</p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>
                        <strong>Stripe</strong> — to process recurring payments and manage subscriptions
                    </li>
                    <li>
                        <strong>TPAL</strong> — to conduct legally compliant prize draws (name, email, state, entry
                        count, tier)
                    </li>
                    <li>
                        <strong>BENY</strong> — if you opt in to the BENY add-on, your phone number is shared to
                        activate access
                    </li>
                    <li>
                        <strong>Email and SMS providers</strong> — to deliver notifications you have opted in to
                    </li>
                </ul>
                <p>
                    We do not sell your personal information. We do not share data with advertisers or marketers beyond
                    aggregated, de-identified analytics.
                </p>
            </>
        )
    },
    {
        heading: 'Notification preferences',
        body: (
            <p>
                You can manage which emails and SMS messages you receive from your Profile page. Transactional messages
                (payment confirmations, account security, winner notifications) cannot be turned off while your account
                is active.
            </p>
        )
    },
    {
        heading: 'Data storage and security',
        body: (
            <p>
                Your data is stored on secure Australian-region cloud infrastructure. Passwords are hashed and never
                stored in plain text. We use TLS for all data in transit and follow industry-standard practices to
                protect against unauthorised access.
            </p>
        )
    },
    {
        heading: 'Your rights',
        body: (
            <>
                <p>Under the Australian Privacy Principles you have the right to:</p>
                <ul className='ml-5 list-disc space-y-1'>
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your account and associated data</li>
                    <li>Opt out of marketing communications</li>
                </ul>
                <p>To exercise these rights, contact us at the email below.</p>
            </>
        )
    },
    {
        heading: 'Cookies',
        body: (
            <p>
                We use a small number of cookies and similar technologies to keep you signed in and to understand how
                the site is used. You can disable cookies in your browser, but some features (like staying logged in)
                will stop working.
            </p>
        )
    },
    {
        heading: 'Changes to this policy',
        body: (
            <p>
                We may update this Privacy Policy from time to time. Material changes will be communicated by email and
                posted on this page with a new &ldquo;Last updated&rdquo; date.
            </p>
        )
    },
    {
        heading: 'Contact and complaints',
        body: (
            <p>
                If you believe we have mishandled your personal information, email us first and we will respond within
                30 days. If you are not satisfied with the response, you may lodge a complaint with the Office of the
                Australian Information Commissioner (OAIC) at oaic.gov.au.
            </p>
        )
    }
];

const PrivacyPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Legal'
                title='Privacy Policy'
                description='How we collect, use, and protect your personal information.'
            />
            <LegalDoc
                lastUpdated='15 May 2026'
                intro={
                    <p>
                        Smart Life Rewards Pty Ltd (&ldquo;SLR&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed
                        to protecting your privacy. This policy explains what information we collect, how we use it, and
                        the rights you have under the Australian Privacy Principles.
                    </p>
                }
                sections={sections}
            />
        </>
    );
};

export default PrivacyPage;
