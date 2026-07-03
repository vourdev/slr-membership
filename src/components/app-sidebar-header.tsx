import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { ProfileDropdown } from './profile-dropdown';
import { Breadcrumbs } from './breaedcrumbs';

export function AppSidebarHeader({ breadcrumbs = [], user }: { breadcrumbs?: any[]; user?: any }) {
    return (
        <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mx-1 h-6' />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className='ms-auto flex items-center gap-2'>
                <ProfileDropdown user={user} />
            </div>
        </header>
    );
}
