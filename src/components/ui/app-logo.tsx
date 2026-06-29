import Image from 'next/image';

export default function AppLogo() {
    return (
        <Image
            alt='SLR Rewards'
            src='/images/slr-rewards-logo.webp'
            width={250}
            height={250}
            priority
            className='h-7 w-auto object-contain'
        />
    );
}
