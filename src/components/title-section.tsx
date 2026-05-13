import React from 'react';

import clsx from 'clsx';

type TitleSectionProps = {
    title: string;
    subtitle?: string;
    className?: string;
};

export const TitleSection: React.FC<TitleSectionProps> = ({ title, subtitle, className }) => {
    return (
        <div className={clsx(className)}>
            <h1 className='text-xl font-bold text-gray-900 lg:text-2xl'>{title}</h1>

            {subtitle && <p className='text-sm text-slate-500'>{subtitle}</p>}
        </div>
    );
};
