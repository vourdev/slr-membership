import { auth } from '@/auth';
import Footer from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';

import ReactLenis from 'lenis/react';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <ReactLenis root>
            <Navbar user={session} />
            {children}
            <Footer />
        </ReactLenis>
    );
}
