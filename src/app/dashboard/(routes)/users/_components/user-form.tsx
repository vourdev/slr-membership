'use client';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { AlertModal } from '@/components/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useRolesDropdown } from '@/hooks/use-roles-dropdown';
import { apiClient } from '@/lib/axios-client';
import { zodResolver } from '@hookform/resolvers/zod';

import { isAxiosError } from 'axios';
import { Eye, EyeOff, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

type AuthHeaders = {
    'Content-Type'?: string;
    Authorization?: string;
};

interface UserProps {
    initialData: any | null;
    role: any | null;
    codeRegion: any | null;
    headers: AuthHeaders;
}

type UsersApiResponse = {
    success: boolean;
    status: number;
    message: string;
    data: {
        user_id: string;
        full_name: string;
        email: string;
        is_active: boolean;
        updated_at?: string;
    };
};

const formSchema = z.object({
    full_name: z.string().min(1, { message: 'Nama wajib diisi' }),
    password: z.string().min(1, { message: 'Password wajib diisi' }).optional(),
    email: z.email({ message: 'Format email tidak valid' }),
    role_id: z.string().min(1, { message: 'Role wajib dipilih' }),
    region_id: z.string().min(1, { message: 'Wilayah wajib diisi' })
});

type UserFormValues = z.infer<typeof formSchema>;

const UserForm: React.FC<UserProps> = ({ initialData, headers, role, codeRegion }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { roles, loading: rolesLoading, error: rolesError } = useRolesDropdown({ headers });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const title = initialData ? 'Edit User' : 'Create User';
    const description = initialData ? 'Edit existing user' : 'Add a new user';
    const toastMsg = initialData ? 'User updated' : 'User created';
    const action = initialData ? 'Save Changes' : 'Create';

    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            full_name: '',
            password: '',
            email: '',
            role_id: '',
            region_id: initialData?.region_id ? String(initialData.region_id) : ''
        }
    });

    useEffect(() => {
        if (role !== 'ROLE_SUPER_ADMIN' && codeRegion) {
            form.setValue('region_id', String(codeRegion));
        }
    }, [role, codeRegion, form]);

    const onSubmit = async (data: UserFormValues) => {
        if (!headers?.Authorization) {
            toast.error('Sesi login tidak tersedia, silakan login ulang');
            router.push('/sign-in');

            return;
        }
        try {
            setLoading(true);

            let res;

            if (initialData?.id) {
                res = await apiClient.put<UsersApiResponse>(`/api/users/${initialData.id}`, data, { headers });
            } else {
                res = await apiClient.post<UsersApiResponse>('/api/users', data, { headers });
            }

            if (res.data?.success) {
                toast.success(res.data.message || toastMsg);
                router.push('/dashboard/users');
                router.refresh();
            } else {
                toast.error(res.data?.error[0]?.msg ?? 'Something went wrong');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.error[0].msg ?? 'Something went wrong');
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        if (!initialData?.id) {
            toast.error('User tidak ditemukan');

            return;
        }

        if (!headers?.Authorization) {
            toast.error('Sesi login tidak tersedia, silakan login ulang');
            router.push('/sign-in');

            return;
        }

        try {
            setLoading(true);

            const res = await apiClient.delete<UsersApiResponse>(`/api/users/${initialData.id}`, { headers });

            if (res.data?.success) {
                toast.success(res.data.message || 'User deleted');
                router.push('/dashboard/users');
                router.refresh();
            } else {
                toast.error(res.data?.message ?? 'Make sure this user is not used in other data');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message ?? 'Something went wrong');
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />

                {initialData && (
                    <Button variant='destructive' size='sm' onClick={() => setOpen(true)}>
                        <Trash className='h-4 w-4' />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name='full_name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Nama lengkap' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            type='email'
                                            placeholder='user@example.com'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className='relative'>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                disabled={loading}
                                                placeholder='Password'
                                                {...field}
                                                className='pr-10'
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword(!showPassword)}
                                                className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                                                {showPassword ? (
                                                    <EyeOff className='h-4 w-4' />
                                                ) : (
                                                    <Eye className='h-4 w-4' />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Wilayah */}

                        {/* Role / Peran */}
                        {(role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_SPV') && (
                            <FormField
                                control={form.control}
                                name='role_id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peran</FormLabel>

                                        {rolesLoading ? (
                                            <p className='text-muted-foreground text-sm'>Memuat role...</p>
                                        ) : rolesError ? (
                                            <p className='text-sm text-red-500'>{rolesError}</p>
                                        ) : (
                                            <Select
                                                disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih peran' />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {roles
                                                        .filter((item) => {
                                                            if (role === 'ROLE_SPV') {
                                                                return (
                                                                    item.label === 'ROLE_SPV' ||
                                                                    item.label === 'ROLE_USER'
                                                                );
                                                            }

                                                            return true;
                                                        })
                                                        .map((filteredRole) => (
                                                            <SelectItem
                                                                key={filteredRole.value}
                                                                value={filteredRole.value}>
                                                                {filteredRole.label}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default UserForm;
