import type { Metadata } from 'next';

import { ComingSoon } from '../_components/coming-soon';

export const metadata: Metadata = {
    title: 'E-Books · SLR Member'
};

export default function EbooksPage() {
    return (
        <ComingSoon
            title='E-Books'
            description='Our digital library of guides and e-books is on its way — full access for RED and BLUE members.'
        />
    );
}
