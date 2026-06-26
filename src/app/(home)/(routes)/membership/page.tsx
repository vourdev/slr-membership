import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { goldButtonStyle } from '@/lib/styles';

import BlueTiersSection from '../(membership)/_components/blue-tiers-section';
import RedTiersSection from '../(membership)/_components/red-tiers-section';
import PageHero from '../_components/page-hero';
import ComparisonMatrix from './_components/comparison-matrix';
import DiscountSpinWheelSection from './_components/discount-spinwheel-section';
import SaveMoreWithBenySection from './_components/save-more-with-beny-section';
import SavingTodaySection from './_components/saving-today-section';
import { CheckCircle2, Sparkles, Tag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Membership · SLR Rewards',
    description:
        "Compare Smart Life Rewards membership tiers — Visitor (free), SLR Red ($10/mo), and SLR Premium ($26/mo). Choose the plan that's right for you."
};

const tierCardStyles = {
    visitor: {
        wrapper: 'border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)]',
        eyebrow: 'text-slr-dim',
        price: 'text-white'
    },
    red: {
        wrapper: 'border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)]',
        eyebrow: 'text-[#E88888]',
        price: 'text-white'
    },
    blue: {
        wrapper: 'border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)]',
        eyebrow: 'text-[#6AB0F0]',
        price: 'text-white'
    }
};

const tiers = [
    {
        key: 'visitor' as const,
        eyebrow: 'Free',
        name: 'Visitor',
        price: 'FREE',
        priceNote: 'No credit card required',
        tagline: 'Try SLR without committing — enter the weekly Visitor draw and explore the platform.',
        bestFor: 'Curious newcomers',
        perks: [
            'Weekly Visitor draw ($50 cash, state-based)',
            'Browse the partner discount directory',
            'Browse e-book listings',
            'Email notifications for new draws'
        ],
        cta: 'Sign Up Free',
        href: '/sign-up'
    },
    {
        key: 'red' as const,
        eyebrow: 'Most popular',
        name: 'SLR Red',
        price: '$10',
        priceNote: '/ month · billed via Stripe',
        tagline: 'Real value from day one — partner discount codes, weekly draws, and full e-book access.',
        bestFor: 'Everyday savers',
        perks: [
            'Up to 7 prize draws every week',
            '4–7 entries per cycle, state + tier pool',
            'Unlock all partner discount codes',
            'Read all e-books in your browser',
            'One Spin Wheel attempt per cycle',
            'Monthly mega draw eligibility'
        ],
        cta: 'Join Red · $10/mo',
        href: '/sign-up'
    },
    {
        key: 'blue' as const,
        eyebrow: 'Best value',
        name: 'SLR Premium',
        price: '$26',
        priceNote: '/ month · billed via Stripe',
        tagline: 'The full SLR experience — premium prize pool, member-only deals, and priority support.',
        bestFor: 'Maximum rewards',
        perks: [
            'Everything in SLR Red',
            '10+ entries per cycle, Premium pool',
            'Premium prize pool (cars, holidays, cash)',
            'Member-only discount deals',
            'Priority customer support',
            'BENY add-on available (+$5/mo)'
        ],
        cta: 'Join Premium · $26/mo',
        href: '/sign-up'
    }
];

const MembershipPage = () => {
    return (
        <main className='bg-slr-ink pt-12'>
            <RedTiersSection />
            <BlueTiersSection />
            <SaveMoreWithBenySection />
            <DiscountSpinWheelSection />
            <SavingTodaySection />
        </main>
    );
};

export default MembershipPage;
