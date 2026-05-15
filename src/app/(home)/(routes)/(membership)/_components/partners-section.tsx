'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import SectionHeading from '@/components/common/section-heading';

import { motion, useAnimationFrame, useMotionValue } from 'motion/react';

const partners = Array.from({ length: 10 }, (_, idx) => ({
    src: `/images/list-partner-logo-${idx + 1}.webp`,
    alt: `Partner Logo ${idx + 1}`
}));

// Auto-scroll speed (pixels per second)
const SPEED = 30;

const PartnersSection = () => {
    const xRow1 = useMotionValue(0);
    const xRow2 = useMotionValue(0);

    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    // Use a ref for drag state so the animation frame always sees the latest value
    const draggingRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize row 1 to start at -halfWidth so it can move right (x increasing toward 0)
    useEffect(() => {
        const init = () => {
            if (row1Ref.current) {
                const half = row1Ref.current.scrollWidth / 2;
                if (half > 0) xRow1.set(-half);
            }
        };
        // Wait one frame for layout
        const t = window.requestAnimationFrame(init);
        return () => window.cancelAnimationFrame(t);
    }, [xRow1]);

    useAnimationFrame((_time, delta) => {
        if (draggingRef.current) return;

        const dx = (SPEED * delta) / 1000;

        // Row 1 — moves right visually: translateX increases toward 0, wraps back to -half
        if (row1Ref.current) {
            const half = row1Ref.current.scrollWidth / 2;
            if (half > 0) {
                let next = xRow1.get() + dx;
                while (next >= 0) next -= half;
                while (next < -half) next += half;
                xRow1.set(next);
            }
        }

        // Row 2 — moves left visually: translateX decreases toward -half, wraps back to 0
        if (row2Ref.current) {
            const half = row2Ref.current.scrollWidth / 2;
            if (half > 0) {
                let next = xRow2.get() - dx;
                while (next <= -half) next += half;
                while (next > 0) next -= half;
                xRow2.set(next);
            }
        }
    });

    const handlePanStart = () => {
        draggingRef.current = true;
        setIsDragging(true);
    };

    const handlePanEnd = () => {
        draggingRef.current = false;
        setIsDragging(false);
    };

    // While dragging, both rows follow the user's horizontal drag direction
    const handlePan = (_: PointerEvent, info: { delta: { x: number } }) => {
        xRow1.set(xRow1.get() + info.delta.x);
        xRow2.set(xRow2.get() + info.delta.x);
    };

    return (
        <section id='partners' className='bg-slr-navy-deep relative overflow-hidden py-16 md:py-24'>
            <div className='px-4 pb-12 text-center'>
                <SectionHeading className='mt-2 text-[42px] leading-none md:text-[50px] lg:text-[60px]'>
                    OUR PARTNERS AND{' '}
                    <span className='text-gradient-gold font-extrabold'>DISCOUNTS</span>
                </SectionHeading>
            </div>

            <motion.div
                className={`mt-10 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onPanStart={handlePanStart}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                style={{ touchAction: 'pan-y' }}>
                {/* Row 1 — moves right when idle */}
                <motion.div ref={row1Ref} className='flex w-max will-change-transform' style={{ x: xRow1 }}>
                    {[...partners, ...partners].map((partner, idx) => (
                        <PartnerCard key={`row1-${idx}`} src={partner.src} alt={partner.alt} />
                    ))}
                </motion.div>

                {/* Row 2 — moves left when idle */}
                <motion.div ref={row2Ref} className='flex w-max will-change-transform' style={{ x: xRow2 }}>
                    {[...partners, ...partners].map((partner, idx) => (
                        <PartnerCard key={`row2-${idx}`} src={partner.src} alt={partner.alt} />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

type PartnerCardProps = {
    src: string;
    alt: string;
};

const PartnerCard: React.FC<PartnerCardProps> = ({ src, alt }) => (
    <div className='border-slr-navy-border bg-slr-navy-foreground/95 flex h-28 w-36 shrink-0 items-center justify-center border sm:h-32 sm:w-44 md:h-36 md:w-52 lg:h-40 lg:w-56'>
        <Image
            src={src}
            alt={alt}
            width={140}
            height={60}
            draggable={false}
            className='pointer-events-none h-8 w-auto object-contain sm:h-9 lg:h-10'
        />
    </div>
);

export default PartnersSection;
