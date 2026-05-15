import { Metadata } from 'next';

import LegalDoc, { LegalSection } from '../_components/legal-doc';
import PageHero from '../_components/page-hero';

export const metadata: Metadata = {
    title: 'Disclaimer · SLR Rewards',
    description: 'Important information about prize draws, partner discounts, and content provided on SLR.'
};

const sections: LegalSection[] = [
    {
        heading: 'General information only',
        body: (
            <p>
                The content published on Smart Life Rewards (SLR) — including blog posts, e-books, prize descriptions,
                and promotional copy — is provided for general information and entertainment purposes only. It does not
                constitute financial, legal, or professional advice.
            </p>
        )
    },
    {
        heading: 'Prize draws',
        body: (
            <p>
                All prize draws are conducted by TPAL, an independent authorised provider, under the relevant state and
                territory permits. Prize values, draw frequency, and entry rules may change with reasonable notice.
                Participation in any draw does not guarantee winning, and odds depend on the total number of entries
                received in your state-tier pool.
            </p>
        )
    },
    {
        heading: 'Partner discounts',
        body: (
            <p>
                Partner discounts and offers are provided by third-party brands. SLR does not control, endorse, or
                guarantee the availability, accuracy, pricing, or quality of any partner offer. Discount codes may be
                withdrawn or modified by the partner at any time without notice. Any dispute relating to a purchase made
                using a partner discount must be resolved directly with the partner.
            </p>
        )
    },
    {
        heading: 'BENY add-on',
        body: (
            <p>
                The BENY discount platform is operated by a third party and is not a service of SLR. By opting in to the
                BENY add-on you agree to BENY&rsquo;s own terms and privacy practices. SLR is not responsible for the
                content, availability, or value of offers within BENY.
            </p>
        )
    },
    {
        heading: 'E-book and educational content',
        body: (
            <p>
                E-books and any educational content available through SLR reflect the views of their authors. They are
                not a substitute for individual professional advice. Always consult a qualified adviser before making
                decisions about your finances, health, or other personal matters.
            </p>
        )
    },
    {
        heading: 'External links',
        body: (
            <p>
                The SLR platform may contain links to external websites. We do not control these sites and are not
                responsible for their content, practices, or availability. Following a link is at your own risk.
            </p>
        )
    },
    {
        heading: 'Limitation of liability',
        body: (
            <p>
                To the maximum extent permitted by law, SLR is not liable for any direct, indirect, or consequential
                loss arising from your use of the Services, your reliance on any content, your participation in any
                draw, or your use of any partner offer. Nothing in this disclaimer limits your rights under the
                Australian Consumer Law.
            </p>
        )
    }
];

const DisclaimerPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Legal'
                title='Disclaimer'
                description='Important information about how to use content, draws, and partner offers on SLR.'
            />
            <LegalDoc lastUpdated='15 May 2026' sections={sections} />
        </>
    );
};

export default DisclaimerPage;
