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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { EbookAdmin, EbookTier } from '@/lib/api/resources/ebooks';
import { zodResolver } from '@hookform/resolvers/zod';

import { ebooksColumns } from './_components/columns';
import { createEbookAction, deleteEbookAction, updateEbookAction } from './actions';
import { Loader2Icon, Plus, TriangleAlert } from 'lucide-react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export type EbookRow = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    coverUrl: string;
    category: string;
    footnote: string;
    tier?: EbookTier;
    reading: number;
    chapters: number;
    locked: string;
};

export type ListError = {
    status: number;
    message: string;
    code: string | null;
    requestId: string | null;
};

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

const EMPTY: FormValues = {
    title: '',
    subtitle: '',
    coverUrl: '',
    description: '',
    category: '',
    footnote: '',
    tierAccess: 'RED',
    readingTimeMinutes: 0
};

const adminToRow = (e: EbookAdmin): EbookRow => ({
    id: e.id,
    title: e.title || '-',
    subtitle: e.subtitle ?? '',
    description: e.description ?? '',
    coverUrl: e.coverUrl ?? '',
    category: e.category || '-',
    footnote: e.footnote ?? '',
    tier: e.tierAccess,
    reading: e.readingTimeMinutes ?? 0,
    chapters: e.chapterCount ?? 0,
    locked: e.tierAccess === 'VISITOR' ? 'No' : 'Yes'
});

const ListErrorCard = ({ error }: { error: ListError }) => (
    <div className='rounded-xl border border-red-500/40 bg-red-500/5 p-4'>
        <div className='flex items-center gap-2 text-red-400'>
            <TriangleAlert className='h-4 w-4' />
            <p className='text-sm font-semibold'>Ebooks list failed — report this to the backend</p>
        </div>
        <dl className='mt-3 grid grid-cols-1 gap-1 font-mono text-xs sm:grid-cols-2'>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>status</dt>
                <dd className='select-all'>{error.status}</dd>
            </div>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>code</dt>
                <dd className='select-all'>{error.code ?? '-'}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>message</dt>
                <dd className='select-all'>{error.message}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>requestId</dt>
                <dd className='select-all'>{error.requestId ?? '-'}</dd>
            </div>
        </dl>
    </div>
);

export function EbooksClient({ initialRows, listError }: { initialRows: EbookRow[]; listError: ListError | null }) {
    const [rows, setRows] = useState<EbookRow[]>(initialRows);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<EbookRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EbookRow | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: EMPTY
    });

    const openCreate = () => {
        setEditing(null);
        form.reset(EMPTY);
        setDialogOpen(true);
    };

    const openEdit = (row: EbookRow) => {
        setEditing(row);
        form.reset({
            title: row.title === '-' ? '' : row.title,
            subtitle: row.subtitle,
            coverUrl: row.coverUrl,
            description: row.description,
            category: row.category === '-' ? '' : row.category,
            footnote: row.footnote,
            tierAccess: row.tier ?? 'RED',
            readingTimeMinutes: row.reading
        });
        setDialogOpen(true);
    };

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const res = editing ? await updateEbookAction(editing.id, values) : await createEbookAction(values);
            if (res.ok) {
                const row = adminToRow(res.data);
                setRows((prev) => (editing ? prev.map((r) => (r.id === editing.id ? row : r)) : [row, ...prev]));
                toast.success(res.message);
                setDialogOpen(false);
                setEditing(null);
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        const { id } = deleteTarget;
        startTransition(async () => {
            const res = await deleteEbookAction(id);
            if (res.ok) {
                setRows((prev) => prev.filter((r) => r.id !== id));
                toast.success(res.message);
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
            setDeleteTarget(null);
        });
    };

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <Heading title='Ebooks' description='Create, edit and remove ebooks' />
                <Button onClick={openCreate}>
                    <Plus className='mr-2 h-4 w-4' />
                    New Ebook
                </Button>
            </div>

            {listError ? <ListErrorCard error={listError} /> : null}

            <DataTable
                searchKey='title'
                columns={ebooksColumns}
                data={rows}
                onEdit={(row) => openEdit(row as EbookRow)}
                onDelete={(row) => setDeleteTarget(row as EbookRow)}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='dashboard-theme dark sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit ebook' : 'New ebook'}</DialogTitle>
                        <DialogDescription>
                            {editing
                                ? 'The list does not expose the tier, so re-select it before saving.'
                                : 'Add an ebook to the library.'}
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
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} placeholder='Optional description' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <div className='grid grid-cols-2 gap-4'>
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
                            </div>
                            <FormField
                                control={form.control}
                                name='tierAccess'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tier access</FormLabel>
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

                            <DialogFooter>
                                <Button type='button' variant='outline' onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type='submit' disabled={isPending}>
                                    {isPending ? <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    {editing ? 'Save' : 'Create'}
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
