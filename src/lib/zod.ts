import { AU_STATE_CODES } from '@/constant/au-states';

import { email, literal, object, string, union, enum as zEnum } from 'zod';

export const SignInSchema = object({
    // `SLRAdmin` is a dev-only bypass login while the auth API is under development.
    email: union([email('Invalid Email'), literal('SLRadmin')]),
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
