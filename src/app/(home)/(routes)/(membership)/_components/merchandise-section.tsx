import Image from 'next/image';

const items = [
    { src: '/images/merchandise-1.webp', alt: 'SLR Smart Life Rewards white cap' },
    { src: '/images/merchandise-2.webp', alt: 'SLR Smart Life Rewards black cap' },
    { src: '/images/merchandise-3.webp', alt: 'SLR Smart Life Rewards black hoodie, front' },
    { src: '/images/merchandise-4.webp', alt: 'SLR Smart Life Rewards black hoodie, back' }
];

const cardStyle = {
    border: '1px solid #403314',
    background: 'linear-gradient(180deg, #212429 0%, #0F1214 100%)'
};

const MerchandiseSection = () => {
    return (
        <section className='relative bg-[#040404] py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='flex items-center gap-3 sm:gap-4'>
                    <span className='h-px flex-1 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                    <h2 className='text-gradient-gold font-bebas-neue shrink-0 text-3xl tracking-wide uppercase md:text-5xl'>
                        Merchandise To Come
                    </h2>
                    <span className='h-px flex-1 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                </div>

                <div className='mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'>
                    {items.map((item) => (
                        <div
                            key={item.src}
                            className='relative h-56 overflow-hidden rounded-2xl sm:h-72 lg:h-80'
                            style={cardStyle}>
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                sizes='(max-width: 1024px) 45vw, 22vw'
                                className='object-contain p-4 sm:p-6'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MerchandiseSection;
