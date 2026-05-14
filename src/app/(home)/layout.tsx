import { auth } from '@/auth';
import Footer from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <div>
            <Navbar user={session} />
            {children}
            <Footer />
        </div>
    );
}
