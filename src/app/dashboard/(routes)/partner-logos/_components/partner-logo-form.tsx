'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ImageUploadField } from '@/components/common/image-upload-field';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { PartnerLogoPayload } from '@/lib/api/resources/partner-logos';
import { zodResolver } from '@hookform/resolvers/zod';

import { createPartnerLogoAction, updatePartnerLogoAction } from '../actions';
import { uploadPartnerLogo } from './upload-asset';
import { ArrowLeft, Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

function isHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);

        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

const formSchema = z.object({
    // The API rejects names under 2 characters.
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Keep the name under 120 characters'),
    logoUrl: z.string().trim().min(1, 'Upload a logo').refine(isHttpUrl, 'Upload a logo or paste a full http(s) URL'),
    websiteUrl: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || isHttpUrl(value), 'Use a full http(s) URL, e.g. https://partner.com.au'),
    sortOrder: z
        .number({ message: 'Enter a number' })
        .int('Use a whole number')
        .min(0, 'Must be 0 or more')
        .max(9999, 'Must be 9999 or less'),
    isActive: z.boolean()
});

type FormValues = z.infer<typeof formSchema>;

interface PartnerLogoFormProps {
    initialData?: {
        id: string;
        name: string;
        logoUrl: string;
        websiteUrl: string;
        sortOrder: number;
        isActive: boolean;
    };
}

export function PartnerLogoForm({ initialData }: PartnerLogoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  name: initialData.name,
                  logoUrl: initialData.logoUrl,
                  websiteUrl: initialData.websiteUrl,
                  sortOrder: initialData.sortOrder,
                  isActive: initialData.isActive
              }
            : { name: '', logoUrl: '', websiteUrl: '', sortOrder: 0, isActive: true }
    });

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const payload: PartnerLogoPayload = {
                name: values.name.trim(),
                logoUrl: values.logoUrl.trim(),
                websiteUrl: values.websiteUrl?.trim() ? values.websiteUrl.trim() : null,
                sortOrder: values.sortOrder,
                isActive: values.isActive
            };

            const res = initialData
                ? await updatePartnerLogoAction(initialData.id, payload)
                : await createPartnerLogoAction(payload);

            if (!res.ok) {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);

                return;
            }

            toast.success(res.message);
            router.push('/dashboard/partner-logos');
        });
    };

    return (
        <div className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6'>
            <div className='flex items-center gap-4'>
                <Button variant='outline' size='icon' asChild>
                    <Link href='/dashboard/partner-logos'>
                        <ArrowLeft className='h-4 w-4' />
                    </Link>
                </Button>
                <Heading
                    title={initialData ? 'Edit Partner Logo' : 'New Partner Logo'}
                    description='Shown in the Community Givebacks section of the homepage — no discount needed.'
                />
            </div>

            <div className='rounded-xl border border-white/10 bg-white/5 p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                        <FormField
                            control={form.control}
                            name='logoUrl'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <FormControl>
                                        <ImageUploadField
                                            value={field.value}
                                            onChange={field.onChange}
                                            onUpload={uploadPartnerLogo}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A transparent PNG or SVG on a wide canvas reads best in the logo strip.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Partner name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Coles' {...field} />
                                        </FormControl>
                                        <FormDescription>Used as the logo&apos;s alt text.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='websiteUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder='https://partner.com.au' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='sortOrder'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={0}
                                                max={9999}
                                                value={Number.isFinite(field.value) ? field.value : 0}
                                                onChange={(e) => {
                                                    const next = e.target.valueAsNumber;
                                                    field.onChange(Number.isFinite(next) ? Math.trunc(next) : 0);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>Lower numbers are shown first.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='isActive'
                            render={({ field }) => (
                                <FormItem className='flex items-center justify-between gap-4'>
                                    <div className='space-y-1'>
                                        <FormLabel>Active</FormLabel>
                                        <FormDescription>Inactive logos are not shown on the homepage.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-end gap-3 border-t border-white/10 pt-6'>
                            <Button type='button' variant='outline' asChild>
                                <Link href='/dashboard/partner-logos'>Cancel</Link>
                            </Button>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> : null}
                                {initialData ? 'Save Changes' : 'Add Partner Logo'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
