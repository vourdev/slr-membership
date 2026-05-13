import Image from 'next/image';

export default function AppLogo() {
    return (
        <>
            <Image alt='Logo' src='/icons/kaltara.png' width={40} height={40} />
            <div className='grid flex-1 text-left text-sm'>
                <span className='mb-0.5 truncate leading-tight font-semibold'>Dashboard Kaltara</span>
            </div>
        </>
    );
}
