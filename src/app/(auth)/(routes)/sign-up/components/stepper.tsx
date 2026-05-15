import { cn } from '@/lib/utils';

import { Check } from 'lucide-react';

type StepperProps = {
    steps: string[];
    current: number;
};

const Stepper = ({ steps, current }: StepperProps) => {
    return (
        <ol className='flex w-full items-center gap-2'>
            {steps.map((label, idx) => {
                const isComplete = idx < current;
                const isActive = idx === current;
                return (
                    <li key={label} className='flex flex-1 items-center gap-2'>
                        <div className='flex items-center gap-2'>
                            <span
                                className={cn(
                                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                                    isComplete && 'border-[#D4AF37] bg-[#D4AF37] text-[#0C1132]',
                                    isActive && 'border-[#D4AF37] bg-[#D4AF370D] text-[#FFDC75]',
                                    !isComplete && !isActive && 'border-white/10 bg-white/2 text-white/40'
                                )}>
                                {isComplete ? <Check className='h-3.5 w-3.5' /> : idx + 1}
                            </span>
                            <span
                                className={cn(
                                    'hidden text-xs font-semibold tracking-wide uppercase sm:inline',
                                    isActive ? 'text-white' : 'text-white/40'
                                )}>
                                {label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <span
                                className={cn(
                                    'h-px flex-1',
                                    idx < current ? 'bg-[#D4AF37]/60' : 'bg-white/10'
                                )}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
};

export default Stepper;
