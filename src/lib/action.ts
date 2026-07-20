'use server';
import { NextResponse } from 'next/server';

import { SignUpSchema } from '@/lib/zod';

export const signUpCredentials = async (prevState: unknown, formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    const validateFields = SignUpSchema.safeParse(data);

    if (!validateFields.success) {
        return {
            error: validateFields.error.flatten().fieldErrors
        };
    }

    const { name, password, email } = validateFields.data;

    const existingUser = false;

    if (existingUser) {
        return {
            error: {
                email: 'Email sudah terdaftar, silakan gunakan email lain.',
                password: '',
                name: ''
            }
        };
    }

    NextResponse.redirect('/sign-in');
};
