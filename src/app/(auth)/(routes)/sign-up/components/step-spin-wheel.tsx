'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { goldButtonStyle } from '@/lib/styles';

import { SpinPrize } from './types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';

type Segment = { label: string; discountPercent: number; fill: string; textColor: string };

const segments: Segment[] = [
    { label: 'No prize', discountPercent: 0, fill: '#1E2530', textColor: '#8EA0B8' },
    { label: '10% off', discountPercent: 10, fill: '#D4AF37', textColor: '#0C1132' },
    { label: 'No prize', discountPercent: 0, fill: '#1E2530', textColor: '#8EA0B8' },
    { label: 'No prize', discountPercent: 0, fill: '#2A0810', textColor: '#E88888' },
    { label: 'No prize', discountPercent: 0, fill: '#1E2530', textColor: '#8EA0B8' },
    { label: '20% off', discountPercent: 20, fill: '#FFE066', textColor: '#0C1132' },
    { label: 'No prize', discountPercent: 0, fill: '#1E2530', textColor: '#8EA0B8' },
    { label: 'No prize', discountPercent: 0, fill: '#142034', textColor: '#6AB0F0' }
];

const SEGMENT_COUNT = segments.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const RADIUS = 140;
const CENTER = 150;

const arcPath = (startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
    const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;

    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const pickSegmentIndex = (): number => {
    const winners = segments
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.discountPercent > 0)
        .map(({ i }) => i);
    const losers = segments
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.discountPercent === 0)
        .map(({ i }) => i);

    // 1/4 chance of winning per PRD flow chart
    if (Math.random() < 0.25) {
        return winners[Math.floor(Math.random() * winners.length)];
    }

    return losers[Math.floor(Math.random() * losers.length)];
};

type StepSpinWheelProps = {
    onNext: (prize: SpinPrize) => void;
    onBack: () => void;
};

const StepSpinWheel = ({ onNext, onBack }: StepSpinWheelProps) => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<{ index: number; segment: Segment } | null>(null);
    const controls = useAnimationControls();

    const handleSpin = async () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);

        const targetIndex = pickSegmentIndex();
        const targetAngle = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
        const fullSpins = 5;
        const finalRotation = 360 * fullSpins - targetAngle;

        await controls.start({
            rotate: finalRotation,
            transition: { duration: 3.4, ease: [0.17, 0.67, 0.21, 0.99] }
        });

        setResult({ index: targetIndex, segment: segments[targetIndex] });
        setSpinning(false);
    };

    const handleContinue = () => {
        if (!result) return;
        onNext({
            label: result.segment.label,
            discountPercent: result.segment.discountPercent
        });
    };

    return (
        <div className='flex flex-col gap-6'>
            <div>
                <h2 className='font-bebas-neue text-3xl tracking-wider text-white uppercase md:text-4xl'>
                    One free spin
                </h2>
                <p className='text-slr-muted mt-1 text-sm'>
                    Every new paid member gets one spin. You might win a discount on your first month.
                </p>
            </div>

            <div className='flex flex-col items-center gap-8 rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-10'>
                <div className='relative'>
                    <svg
                        width='300'
                        height='300'
                        viewBox='0 0 300 300'
                        className='drop-shadow-[0_0_30px_rgba(212,175,55,0.25)]'>
                        <circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS + 8}
                            fill='url(#wheelBorder)'
                            stroke='#FFDC75'
                            strokeWidth='2'
                        />
                        <defs>
                            <linearGradient id='wheelBorder' x1='0' y1='0' x2='1' y2='1'>
                                <stop offset='0%' stopColor='#F5D78E' />
                                <stop offset='50%' stopColor='#D4AF37' />
                                <stop offset='100%' stopColor='#A07018' />
                            </linearGradient>
                        </defs>

                        <motion.g animate={controls} initial={{ rotate: 0 }} style={{ transformOrigin: 'center' }}>
                            {segments.map((seg, i) => {
                                const startAngle = i * SEGMENT_ANGLE;
                                const endAngle = startAngle + SEGMENT_ANGLE;
                                const midAngle = startAngle + SEGMENT_ANGLE / 2;
                                const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.65, midAngle);

                                return (
                                    <g key={i}>
                                        <path
                                            d={arcPath(startAngle, endAngle)}
                                            fill={seg.fill}
                                            stroke='rgba(255,255,255,0.08)'
                                            strokeWidth='1'
                                        />
                                        <text
                                            x={labelPos.x}
                                            y={labelPos.y}
                                            fill={seg.textColor}
                                            fontSize='12'
                                            fontWeight='700'
                                            textAnchor='middle'
                                            dominantBaseline='middle'
                                            transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}>
                                            {seg.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </motion.g>

                        <circle cx={CENTER} cy={CENTER} r='18' fill='#0C1132' stroke='#D4AF37' strokeWidth='2' />
                        <circle cx={CENTER} cy={CENTER} r='5' fill='#FFDC75' />
                    </svg>

                    <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1' aria-hidden='true'>
                        <svg width='28' height='32' viewBox='0 0 28 32'>
                            <path
                                d='M 14 30 L 0 6 A 14 14 0 0 1 28 6 Z'
                                fill='#FFDC75'
                                stroke='#0C1132'
                                strokeWidth='1.5'
                            />
                        </svg>
                    </div>
                </div>

                {result && (
                    <div
                        className={
                            result.segment.discountPercent > 0
                                ? 'rounded-xl border border-[#D4AF3759] bg-[#D4AF370D] px-6 py-4 text-center'
                                : 'rounded-xl border border-white/10 bg-white/2 px-6 py-4 text-center'
                        }>
                        {result.segment.discountPercent > 0 ? (
                            <>
                                <Sparkles className='mx-auto h-6 w-6 text-[#FFDC75]' />
                                <p className='font-bebas-neue mt-2 text-2xl tracking-wider text-white uppercase'>
                                    You won {result.segment.label}!
                                </p>
                                <p className='text-slr-muted mt-1 text-xs'>
                                    Your discount will be applied at checkout.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className='font-bebas-neue text-xl tracking-wider text-white uppercase'>
                                    Better luck next cycle
                                </p>
                                <p className='text-slr-muted mt-1 text-xs'>
                                    You can spin again at the start of your next billing cycle.
                                </p>
                            </>
                        )}
                    </div>
                )}

                {!result && (
                    <Button
                        type='button'
                        onClick={handleSpin}
                        disabled={spinning}
                        style={goldButtonStyle}
                        className='h-12 rounded-xl px-12 font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
                        {spinning ? 'Spinning…' : 'Spin the wheel'}
                    </Button>
                )}
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onBack}
                    disabled={spinning}
                    className='h-11 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto'>
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <Button
                    type='button'
                    onClick={handleContinue}
                    disabled={!result || spinning}
                    style={goldButtonStyle}
                    className='h-11 flex-1 rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
                    Continue to checkout
                </Button>
            </div>
        </div>
    );
};

export default StepSpinWheel;
