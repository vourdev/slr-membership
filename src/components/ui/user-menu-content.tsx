import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/logout-action';

import { UserInfo } from './user-info';
import { LogOut } from 'lucide-react';

interface UserMenuContentProps {
    user: any;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    return (
        <>
            <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
        </>
    );
}
