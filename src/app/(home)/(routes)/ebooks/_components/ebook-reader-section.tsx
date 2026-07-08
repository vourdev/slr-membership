import { EbookReader } from '@/components/common/ebook-reader';

import { chapters } from './ebook-chapters';

const EbookReaderSection = () => {
    return (
        <section id='guide' className='scroll-mt-24 bg-[#0B0D0F]'>
            <EbookReader
                chapters={chapters}
                finishLabel='You Finished the Blueprint'
                shareTitle='Smart Living Blueprint'
                shareText='Read the Smart Living Blueprint on SLR Rewards.'
                nextHref='/ebooks'
            />
        </section>
    );
};

export default EbookReaderSection;
