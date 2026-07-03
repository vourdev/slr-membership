import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

export function UserInfo({
    user,
    showEmail = false,
    showUsername = true,
    className = ''
}: {
    user: any;
    showEmail?: boolean;
    showUsername?: boolean;
    className?: string;
}) {
    const getInitials = useInitials();

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>{getInitials(user?.name ?? 'User')}</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
                {showUsername && <span className='truncate font-medium'>{user.name}</span>}
                {showEmail && <span className='text-muted-foreground truncate text-xs'>{user.email}</span>}
            </div>
        </div>
    );
}
