import { GOLD_GRADIENT } from '@/lib/styles';

// Gold gradients for the "CLUB" wordmark and the prize-pool figure.
const clubGradient = 'linear-gradient(180deg, #73470A 0%, #FFD44D 30%, #FFFFD9 50%, #F2B32E 70%, #664008 100%)';
const priceGradient = 'linear-gradient(180deg, #73470A 0%, #FFD44D 30%, #E3E30E 50%, #F2B32E 70%, #664008 100%)';

// Layered glow + drop shadow behind the "CLUB" wordmark.
const clubGlow =
    'drop-shadow(0px 12px 20px #000000B2) drop-shadow(0px 0px 50px #FFB2338C) drop-shadow(0px 0px 100px #FFB2334D)';

const MembershipClubSection = () => {
    return (
        <section className='bg-slr-ink relative isolate overflow-hidden py-16 md:py-24'>
            <div className='mx-auto max-w-3xl px-4 text-center'>
                <h2 className='font-bebas-neue leading-[0.85] tracking-wide uppercase'>
                    <span className='text-gradient-silver block text-4xl sm:text-5xl md:text-6xl'>Membership</span>
                    <span
                        className='block bg-clip-text text-6xl text-transparent sm:text-7xl md:text-[112px]'
                        style={{ backgroundImage: clubGradient, filter: clubGlow }}>
                        Club
                    </span>
                </h2>

                <div className='mx-auto mt-12 w-full max-w-xs rounded-2xl p-0.5' style={{ background: GOLD_GRADIENT }}>
                    <div className='rounded-[14px] bg-[#F1FBFE] px-6 py-8 shadow-[0px_12px_40px_0px_#00000080] sm:px-10'>
                        <p className='text-sm font-bold tracking-[0.3em] text-[#1A1408] uppercase sm:text-base'>
                            Prize Pool
                        </p>
                        <p
                            className='font-bebas-neue my-3 bg-clip-text text-7xl leading-none font-extrabold text-transparent sm:text-8xl'
                            style={{ backgroundImage: priceGradient }}>
                            $2100
                        </p>
                        <p className='text-xs font-bold tracking-[0.2em] text-[#1A1408] uppercase sm:text-sm'>
                            @ 22 Prizes • One Month
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MembershipClubSection;
