import clsx from 'clsx';

interface LegendItemProps {
    label: string;
    range?: string;
    showRange?: boolean;
    className?: string;
    bgClass?: string;
    bgColor?: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({
    label,
    bgClass,
    bgColor,
    range,
    showRange = false,
    className
}) => {
    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <div className={clsx('h-4 w-4 shrink-0 rounded-full', bgClass)} style={{ backgroundColor: bgColor }} />

            <div className='flex flex-col text-xs md:text-sm'>
                <span className='font-semibold text-gray-900'>{label}</span>
                {showRange && range && <span className='text-gray-600'>{range}</span>}
            </div>
        </div>
    );
};
