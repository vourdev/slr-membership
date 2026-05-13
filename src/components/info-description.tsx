type DescriptionBlockProps = {
    title: string;
    description: string;
    className?: string;
};

export const InfoDescription: React.FC<DescriptionBlockProps> = ({ title, description, className }) => {
    return (
        <div className={className}>
            <p className='mb-1 font-medium text-gray-900'>{title}</p>
            <p className='leading-relaxed text-slate-600'>{description}</p>
        </div>
    );
};
