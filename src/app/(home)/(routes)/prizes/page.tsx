import WelcomeSection from '../(membership)/_components/welcome-section';
import MembershipClubSection from './_components/membership-club-section';
import SlrLifeTiersSection from './_components/slr-life-tiers-section';
import VisitorRedBlueSection from './_components/visitor-red-blue-section';

const Page = () => {
    return (
        <main className='bg-slr-ink pt-12'>
            <MembershipClubSection />
            <VisitorRedBlueSection />
            <WelcomeSection />
            <SlrLifeTiersSection />
        </main>
    );
};

export default Page;
