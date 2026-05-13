import Link from 'next/link';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';

import { UserNavClient } from './user-nav-client';

export async function UserNav() {
    const session = await auth();

    if (!session?.user) {
        return (
            <Link href='/sign-in' className='hidden justify-self-end xl:flex'>
                <Button className='rounded-full px-5 py-5'>Login</Button>
            </Link>
        );
    }

    return (
        <div className='hidden w-auto justify-self-end rounded-full xl:flex'>
            <UserNavClient user={session.user} />
        </div>
    );
}
