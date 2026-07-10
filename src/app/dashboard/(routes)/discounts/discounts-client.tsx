'use client';

import { useState, useTransition } from 'react';

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
import type { DiscountAdmin, UpdateDiscountPayload } from '@/lib/api/resources/discounts';
import { zodResolver } from '@hookform/resolvers/zod';

import { discountsColumns } from './_components/columns';
import { createDiscountAction, deleteDiscountAction, getDiscountAction, updateDiscountAction } from './actions';
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

export function DiscountsClient({
    initialRows,
    listError
}: {
    initialRows: DiscountRow[];
    listError: ListError | null;
}) {
    const [rows, setRows] = useState<DiscountRow[]>(initialRows);
    // Full records for session create/edit — used to prefill the edit form (admin
    // can't GET a discount: the detail endpoint is 403, like the list).
    const [fullById, setFullById] = useState<Record<string, DiscountAdmin>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<DiscountRow | null>(null);
    // Whether the edited row's isActive is authoritatively known (session record).
    // The list + GET detail omit isActive, so for backend-listed rows we only send
    // isActive when the admin actually toggles it (avoids clobbering the real value).
    const [activeKnown, setActiveKnown] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '', partnerName: '', category: '', description: '', isFeatured: false, isActive: true }
    });

    const openCreate = () => {
        setEditing(null);
        form.reset({ title: '', partnerName: '', category: '', description: '', isFeatured: false, isActive: true });
        setDialogOpen(true);
    };

    const openEdit = (row: DiscountRow) => {
        const full = fullById[row.id];
        setEditing(row);
        setActiveKnown(Boolean(full));
        // Immediate prefill from what we already have (session record or the row).
        form.reset({
            title: row.title === '-' ? '' : row.title,
            partnerName: row.partner === '-' ? '' : row.partner,
            category: row.category === '-' ? '' : row.category,
            description: full?.description ?? '',
            isFeatured: row.featured === 'Yes',
            isActive: full ? full.isActive : true
        });
        setDialogOpen(true);

        // For rows we didn't create this session, pull authoritative fields (esp.
        // description, which the list row lacks) — GET /discounts/{id} works for admin now.
        if (!full) {
            startTransition(async () => {
                const res = await getDiscountAction(row.id);
                if (res.ok) {
                    form.reset({
                        title: res.data.title || '',
                        partnerName: res.data.partner_name || '',
                        category: res.data.category || '',
                        description: res.data.description ?? '',
                        isFeatured: res.data.is_featured,
                        isActive: form.getValues('isActive')
                    });
                }
            });
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditing(null);
    };

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            if (editing) {
                // Description now comes from GET /discounts/{id} (or a session record) → send it.
                // isActive isn't exposed by the list/GET, so only send it when authoritative
                // or the admin actually toggled it — otherwise PATCH's merge keeps the real value.
                const sendActive = activeKnown || form.formState.dirtyFields.isActive;
                const payload: UpdateDiscountPayload = {
                    title: values.title,
                    partnerName: values.partnerName,
                    category: values.category,
                    isFeatured: values.isFeatured,
                    description: values.description ?? '',
                    ...(sendActive ? { isActive: values.isActive } : {})
                };
                const res = await updateDiscountAction(editing.id, payload);
                if (res.ok) {
                    setRows((prev) => prev.map((r) => (r.id === res.data.id ? adminToRow(res.data) : r)));
                    setFullById((prev) => ({ ...prev, [res.data.id]: res.data }));
                    toast.success(res.message);
                    closeDialog();
                } else {
                    toast.error(res.code ? `${res.message} (${res.code})` : res.message);
                }

                return;
            }

            const res = await createDiscountAction(values);
            if (res.ok) {
                setRows((prev) => [adminToRow(res.data), ...prev]);
                setFullById((prev) => ({ ...prev, [res.data.id]: res.data }));
                toast.success(res.message);
                closeDialog();
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
        });
    };

    // DataTable's action column shows its own confirm dialog before calling this.
    const handleDelete = (row: DiscountRow) => {
        startTransition(async () => {
            const res = await deleteDiscountAction(row.id);
            if (res.ok) {
                setRows((prev) => prev.filter((r) => r.id !== row.id));
                setFullById((prev) => {
                    const next = { ...prev };
                    delete next[row.id];

                    return next;
                });
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <Heading title='Discounts' description='Create, edit and remove partner discounts' />
                <Button onClick={openCreate}>
                    <Plus className='mr-2 h-4 w-4' />
                    New Discount
                </Button>
            </div>

            {listError ? <ListErrorCard error={listError} /> : null}

            <DataTable
                searchKey='title'
                columns={discountsColumns}
                data={rows}
                onEdit={(row) => openEdit(row as DiscountRow)}
                onDelete={(row) => handleDelete(row as DiscountRow)}
            />

            <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
                <DialogContent className='dashboard-theme dark sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit discount' : 'New discount'}</DialogTitle>
                        <DialogDescription>
                            {editing ? 'Update this partner discount.' : 'Add a partner discount to the platform.'}
                        </DialogDescription>
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
                                <Button type='button' variant='outline' onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type='submit' disabled={isPending}>
                                    {isPending ? <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    {editing ? 'Save changes' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
