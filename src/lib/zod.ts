import { email, enum as zEnum, object, string } from 'zod';

import { AU_STATE_CODES } from '@/constant/au-states';

export const SignInSchema = object({
    email: email('Invalid Email'),
    password: string().min(8, 'Password must be more than 8 characters')
});

export const SignUpSchema = object({
    name: string().min(1, 'Name is required'),
    email: email('Invalid Email'),
    password: string()
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    state: zEnum(AU_STATE_CODES, { message: 'Select your state or territory' }),
    phone: string()
        .min(8, 'Enter a valid Australian phone number')
        .regex(/^[0-9 +()-]+$/, 'Only digits, spaces, +, -, () allowed')
});
