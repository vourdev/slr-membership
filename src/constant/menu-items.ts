import { IMenuItem } from '@/types/menu-items';

export const menuItems: IMenuItem[] = [
    {
        text: 'Home',
        url: '/'
    },
    {
        text: 'Membership',
        url: '/membership'
    },
    {
        text: 'Prizes',
        url: '/prizes'
    },
    {
        text: 'E-Books',
        url: '/ebooks',
        authRequired: true
    },
    {
        text: 'E-Book Library',
        url: '/ebook-library'
    },
    {
        text: 'About',
        url: '/about'
    },

    {
        text: 'Contact',
        url: '/contact'
    }
];
