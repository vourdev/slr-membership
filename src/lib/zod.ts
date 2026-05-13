import { email, object, string } from 'zod';

export const SignInSchema = object({
    email: email('Invalid Email'),
    password: string().min(8, 'Password must be more than 8 characters')
});

export const SignUpSchema = object({
    name: string().min(1, 'Name must be more than 1 characters'),
    email: email('Invalid Email'),
    password: string()
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters')
});
