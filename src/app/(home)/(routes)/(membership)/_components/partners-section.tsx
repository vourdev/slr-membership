import Image from 'next/image';

const partners = Array.from({ length: 10 }, (_, idx) => ({
    src: `/images/list-partner-logo-${idx + 1}.webp`,
    alt: `Partner Logo ${idx + 1}`
}));

const PartnersSection = () => {
    return (
        <section id='partners' className='slr-section-bg py-16 md:py-20'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <h2 className='text-slr-navy-foreground text-2xl font-extrabold md:text-3xl'>
                        OUR PARTNERS AND <span className='text-slr-gold'>DISCOUNTS</span>
                    </h2>
                </div>

                <div className='mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5'>
                    {partners.map((partner) => (
                        <div
                            key={partner.src}
                            className='border-slr-navy-border/60 bg-slr-navy-foreground/95 flex items-center justify-center rounded-xl border p-5 transition-transform hover:scale-105'>
                            <Image
                                src={partner.src}
                                alt={partner.alt}
                                width={140}
                                height={60}
                                className='h-10 w-auto object-contain'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
