'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import type { EbookTier } from '@/lib/api/resources/ebooks';
import { zodResolver } from '@hookform/resolvers/zod';

import { createEbookAction, updateEbookAction } from '../actions';
import { ArrowLeft, Info, Loader2Icon } from 'lucide-react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const TIERS: EbookTier[] = ['VISITOR', 'RED', 'BLUE'];

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional(),
    coverUrl: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    footnote: z.string().optional(),
    tierAccess: z.enum(['VISITOR', 'RED', 'BLUE']),
    readingTimeMinutes: z.number().min(0, 'Must be 0 or more')
});

type FormValues = z.infer<typeof formSchema>;

interface EbookFormProps {
    initialData?: {
        id: string;
        title: string;
        subtitle: string;
        description: string;
        coverUrl: string;
        category: string;
        footnote: string;
        tierAccess: EbookTier;
        readingTimeMinutes: number;
    };
}

export function EbookForm({ initialData }: EbookFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const title = initialData ? 'Edit Ebook' : 'New Ebook';
    const description = initialData ? 'Update details of the ebook.' : 'Add a new ebook to the library.';

    const defaultValues: FormValues = initialData
        ? {
              title: initialData.title,
              subtitle: initialData.subtitle,
              coverUrl: initialData.coverUrl,
              description: initialData.description,
              category: initialData.category,
              footnote: initialData.footnote,
              tierAccess: initialData.tierAccess,
              readingTimeMinutes: initialData.readingTimeMinutes
          }
        : {
              title: '',
              subtitle: '',
              coverUrl: '',
              description: '',
              category: '',
              footnote: '',
              tierAccess: 'RED',
              readingTimeMinutes: 0
          };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues
    });

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const res = initialData ? await updateEbookAction(initialData.id, values) : await createEbookAction(values);

            if (res.ok) {
                toast.success(res.message);
                router.push('/dashboard/ebooks');
                router.refresh();
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
        });
    };

    return (
        <div className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6'>
            <div className='flex items-center gap-4'>
                <Button variant='outline' size='icon' asChild>
                    <Link href='/dashboard/ebooks'>
                        <ArrowLeft className='h-4 w-4' />
                    </Link>
                </Button>
                <Heading title={title} description={description} />
            </div>

            <div className='rounded-xl border border-white/10 bg-white/5 p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Smart Money Essentials' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='subtitle'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Optional subtitle' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content / Description</FormLabel>
                                    <FormControl>
                                        <WysiwygEditor
                                            placeholder='Write the ebook content or description...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='coverUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder='https://…' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='footnote'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Footnote</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Optional footnote' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            <FormField
                                control={form.control}
                                name='category'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Finance' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='readingTimeMinutes'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reading (min)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={0}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='tierAccess'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1.5'>
                                            Tier access
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className='h-3.5 w-3.5 cursor-help text-white/50 transition-colors hover:text-white' />
                                                </TooltipTrigger>
                                                <TooltipContent className='dashboard-theme dark max-w-[250px] border border-white/10 bg-black p-2 text-xs text-white'>
                                                    {initialData
                                                        ? 'Re-select the tier if editing a previously listed ebook.'
                                                        : 'Select access level.'}
                                                </TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select tier' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='dashboard-theme dark'>
                                                {TIERS.map((t) => (
                                                    <SelectItem key={t} value={t}>
                                                        {t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex justify-end gap-3 border-t border-white/10 pt-6'>
                            <Button type='button' variant='outline' asChild>
                                <Link href='/dashboard/ebooks'>Cancel</Link>
                            </Button>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> : null}
                                {initialData ? 'Save Changes' : 'Create Ebook'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
