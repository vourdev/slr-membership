const PricingSection = () => {
    return (
        <section id='pricing' className='bg-slr-navy-deep mx-auto max-w-7xl px-4'>
            <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                {/* Visitor */}
                <div className='h- flex flex-col items-center justify-between rounded-xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                    <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                        Visitor
                    </p>
                    <p className='font-bebas-neue mt-2 text-[40px] font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                        FREE
                    </p>
                    <div className='invisible h-4 sm:h-5 md:h-6' aria-hidden='true' />
                </div>

                {/* Red */}
                <div className='flex h-55.5 flex-col items-center justify-between rounded-xl border border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                    <p className='text-[10px] font-semibold tracking-widest text-[#2878E8] uppercase sm:text-xs md:text-sm'>
                        RED
                    </p>
                    <p className='font-bebas-neue mt-2 bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-[40px] font-extrabold text-transparent sm:text-[52px] md:text-[60px] lg:text-[70px] xl:text-[70px]'>
                        $10
                    </p>
                    <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>/month</p>
                </div>

                {/* SLR Premium */}
                <div className='flex h-55.5 flex-col items-center justify-between rounded-xl border border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                    <p className='text-[10px] font-semibold tracking-widest text-[#2878E8] uppercase sm:text-xs md:text-sm'>
                        SLR Premium
                    </p>
                    <p className='font-bebas-neue mt-2 bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-[40px] font-extrabold text-transparent sm:text-[52px] md:text-[60px] lg:text-[70px] xl:text-[70px]'>
                        $26
                    </p>
                    <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>/month</p>
                </div>
            </div>

            <p className='text-md mx-auto mt-12 max-w-xl px-4 text-center text-[#CDCECF] md:text-lg'>
                Smart Life Rewards is a membership platform designed to help Australians access value through rewards,
                promotional prizes, partner discounts, and digital offers.
            </p>
        </section>
    );
};

export default PricingSection;
