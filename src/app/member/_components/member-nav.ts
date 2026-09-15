import {
    BookOpen,
    CreditCard,
    Gift,
    History,
    LayoutDashboard,
    type LucideIcon,
    TicketPercent,
    Trophy,
    UserCircle,
    Users
} from 'lucide-react';

export interface MemberNavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    /** RED/BLUE only — shown with a lock to a member who is back on Visitor after cancelling. */
    paidOnly?: boolean;
}

export const MEMBER_NAV: MemberNavItem[] = [
    { title: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { title: 'Prizes', href: '/member/prizes', icon: Trophy },
    { title: 'Prize Draws', href: '/member/giveaways', icon: Gift, paidOnly: true },
    { title: 'Discounts', href: '/member/discounts', icon: TicketPercent, paidOnly: true },
    { title: 'E-Books', href: '/member/ebooks', icon: BookOpen, paidOnly: true },
    { title: 'Entry History', href: '/member/entry-history', icon: History },
    { title: 'Membership', href: '/member/membership', icon: CreditCard },
    { title: 'Profile', href: '/member/profile', icon: UserCircle }
];
