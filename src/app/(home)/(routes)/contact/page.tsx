import { Metadata } from 'next';

import { Clock, HelpCircle, Mail, MapPin } from 'lucide-react';

import PageHero from '../_components/page-hero';
import ContactForm from './_components/contact-form';

export const metadata: Metadata = {
    title: 'Contact · SLR Rewards',
    description: 'Get in touch with the Smart Life Rewards support team. We typically reply within one business day.'
};

const infoCards = [
    {
        icon: Mail,
        title: 'Email support',
        body: 'support@slrrewards.com.au',
        hint: 'For account, billing, and general help'
    },
    {
        icon: Clock,
        title: 'Response time',
        body: 'Within 1 business day',
        hint: 'Mon–Fri · 9am–5pm AEST'
    },
    {
        icon: MapPin,
        title: 'Based in Australia',
        body: 'Smart Life Rewards Pty Ltd',
        hint: 'Serving every state and territory'
    },
    {
        icon: HelpCircle,
        title: 'Check the FAQ first',
        body: 'Most questions answered',
        hint: 'Visit our Help Centre'
    }
];

const ContactPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Get In Touch'
                title='Contact Us'
                description="Questions about your membership, billing, or a draw? Send us a message and we'll respond within one business day."
            />

            <section className='bg-slr-navy-deep relative py-12 md:py-16'>
                <div className='mx-auto max-w-6xl px-4'>
                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-5'>
                        <aside className='space-y-4 lg:col-span-2'>
                            {infoCards.map(({ icon: Icon, title, body, hint }) => (
                                <div
                                    key={title}
                                    className='flex items-start gap-4 rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-5 shadow-[0px_0px_20px_0px_#776D6D26]'>
                                    <div
                                        className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl'
                                        style={{
                                            background:
                                                'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                                            border: '1px solid #D4AF3759'
                                        }}>
                                        <Icon className='h-5 w-5 text-[#FFDC75]' />
                                    </div>
                                    <div>
                                        <p className='font-bebas-neue text-xl tracking-wider text-white uppercase'>
                                            {title}
                                        </p>
                                        <p className='mt-0.5 text-sm font-medium text-white'>{body}</p>
                                        <p className='mt-1 text-xs text-[#8EA0B8]'>{hint}</p>
                                    </div>
                                </div>
                            ))}
                        </aside>

                        <div className='lg:col-span-3'>
                            <div className='rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-8'>
                                <h2 className='font-bebas-neue text-3xl tracking-wider text-white uppercase md:text-4xl'>
                                    Send us a message
                                </h2>
                                <p className='mt-2 mb-6 text-sm text-[#CDCECF]'>
                                    Fill in the form below and our support team will get back to you.
                                </p>
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactPage;
