'use client';

import { useState, useTransition } from 'react';

import { AlertModal } from '@/components/alert-modal';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { DiscountAdmin } from '@/lib/api/resources/discounts';
import { zodResolver } from '@hookform/resolvers/zod';

import { discountsColumns } from './_components/columns';
import { createDiscountAction, deleteDiscountAction } from './actions';
import { Loader2Icon, Plus, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export type DiscountRow = {
    id: string;
    title: string;
    partner: string;
    category: string;
    featured: string;
    active: string;
};

export type ListError = {
    status: number;
    message: string;
    code: string | null;
    requestId: string | null;
};

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    partnerName: z.string().min(1, 'Partner name is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    isFeatured: z.boolean(),
    isActive: z.boolean()
});

type FormValues = z.infer<typeof formSchema>;

const adminToRow = (d: DiscountAdmin): DiscountRow => ({
    id: d.id,
    title: d.title || '-',
    partner: d.partnerName || '-',
    category: d.category || '-',
    featured: d.isFeatured ? 'Yes' : 'No',
    active: d.isActive ? 'Yes' : 'No'
});

const ListErrorCard = ({ error }: { error: ListError }) => (
    <div className='rounded-xl border border-red-500/40 bg-red-500/5 p-4'>
        <div className='flex items-center gap-2 text-red-400'>
            <TriangleAlert className='h-4 w-4' />
            <p className='text-sm font-semibold'>Discounts list unavailable — report this to the backend</p>
        </div>
        <p className='text-muted-foreground mt-1 text-xs'>
            {`GET /api/v1/discounts/ failed, so existing discounts can't be shown. New discounts you create below still work and can be deleted.`}
        </p>
        <dl className='mt-3 grid grid-cols-1 gap-1 font-mono text-xs sm:grid-cols-2'>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>status</dt>
                <dd className='text-white select-all'>{error.status}</dd>
            </div>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>code</dt>
                <dd className='text-white select-all'>{error.code ?? '-'}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>message</dt>
                <dd className='text-white select-all'>{error.message}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>requestId</dt>
                <dd className='text-white select-all'>{error.requestId ?? '-'}</dd>
            </div>
        </dl>
    </div>
);

export function DiscountsClient({ initialRows, listError }: { initialRows: DiscountRow[]; listError: ListError | null }) {
    const [rows, setRows] = useState<DiscountRow[]>(initialRows);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<DiscountRow | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '', partnerName: '', category: '', description: '', isFeatured: false, isActive: true }
    });

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const res = await createDiscountAction(values);
            if (res.ok) {
                setRows((prev) => [adminToRow(res.data), ...prev]);
                toast.success(res.message);
                form.reset();
                setDialogOpen(false);
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        const { id } = deleteTarget;
        startTransition(async () => {
            const res = await deleteDiscountAction(id);
            if (res.ok) {
                setRows((prev) => prev.filter((r) => r.id !== id));
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            setDeleteTarget(null);
        });
    };

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <Heading title='Discounts' description='Create and remove partner discounts' />
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    New Discount
                </Button>
            </div>

            {listError ? <ListErrorCard error={listError} /> : null}

            <DataTable
                searchKey='title'
                columns={discountsColumns}
                data={rows}
                onDelete={(row) => setDeleteTarget(row as DiscountRow)}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='dashboard-theme dark sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>New discount</DialogTitle>
                        <DialogDescription>Add a partner discount to the platform.</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder='20% off at …' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='partnerName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Partner name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Partner Pty Ltd' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='category'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Dining, Travel, …' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} placeholder='Optional details' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex gap-8'>
                                <FormField
                                    control={form.control}
                                    name='isFeatured'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-2'>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel className='mt-0!'>Featured</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='isActive'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-2'>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel className='mt-0!'>Active</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type='button' variant='outline' onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type='submit' disabled={isPending}>
                                    {isPending ? <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                loading={isPending}
                className='dashboard-theme dark'
            />
        </div>
    );
}
