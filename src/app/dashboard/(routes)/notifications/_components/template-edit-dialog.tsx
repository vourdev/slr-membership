'use client';

import { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { NotificationTemplate } from '@/types/member';
import { zodResolver } from '@hookform/resolvers/zod';

import { saveNotificationTemplateAction } from '../actions';
import { HtmlEmailPreview } from './html-email-preview';
import { Code, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
    subject: z.string().trim().min(1, 'Subject is required.').max(255, 'Subject must be 255 characters or fewer.'),
    body: z.string().trim().min(1, 'Body is required.'),
    is_active: z.boolean()
});

type FormValues = z.infer<typeof schema>;

function toFormValues(template: NotificationTemplate): FormValues {
    return { subject: template.subject, body: template.body, is_active: template.is_active };
}

export function TemplateEditDialog({
    template,
    open,
    onOpenChange
}: {
    template: NotificationTemplate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { subject: '', body: '', is_active: true }
    });

    useEffect(() => {
        if (template) {
            form.reset(toFormValues(template));
            setViewMode('code');
        }
    }, [template, form]);

    const onSubmit = async (values: FormValues) => {
        if (!template) return;

        setIsSaving(true);
        const result = await saveNotificationTemplateAction(template.id, values);
        setIsSaving(false);

        if (result.ok) {
            form.reset(toFormValues(result.data));
            toast.success(result.message);
            onOpenChange(false);

            return;
        }

        toast.error(result.message);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'dashboard-theme dark border-slr-navy-border bg-slr-navy-deep flex max-h-[calc(100dvh-3rem)] flex-col overflow-hidden p-0 text-white shadow-2xl transition-all duration-200',
                    viewMode === 'preview' ? 'sm:max-w-3xl' : 'sm:max-w-2xl'
                )}>
                <DialogHeader className='border-slr-navy-border shrink-0 border-b p-6 pb-4 text-left'>
                    <DialogTitle className='text-xl font-semibold text-white'>Edit template</DialogTitle>
                    <DialogDescription className='text-slr-dim text-xs'>
                        {template ? `${template.type} · ${template.channel}` : ''}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                        <div className='min-h-0 flex-1 space-y-5 overflow-y-auto p-6'>
                            <FormField
                                control={form.control}
                                name='subject'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-medium text-white'>Subject</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                maxLength={255}
                                                className='bg-slr-navy-card border-slr-navy-border placeholder:text-slr-dim focus-visible:ring-primary/50 text-white'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='body'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex flex-wrap items-center justify-between gap-2'>
                                            <FormLabel className='text-sm font-medium text-white'>Body</FormLabel>
                                            <div className='border-slr-navy-border bg-slr-navy-card/80 flex items-center gap-1 rounded-lg border p-0.5'>
                                                <button
                                                    type='button'
                                                    onClick={() => setViewMode('code')}
                                                    className={cn(
                                                        'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                                        viewMode === 'code'
                                                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                                            : 'text-slr-dim hover:text-white'
                                                    )}>
                                                    <Code className='size-3.5' />
                                                    HTML Code
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setViewMode('preview')}
                                                    className={cn(
                                                        'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                                        viewMode === 'preview'
                                                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                                            : 'text-slr-dim hover:text-white'
                                                    )}>
                                                    <Eye className='size-3.5' />
                                                    Preview as HTML
                                                </button>
                                            </div>
                                        </div>

                                        {viewMode === 'code' ? (
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    rows={12}
                                                    className='bg-slr-navy-card border-slr-navy-border placeholder:text-slr-dim focus-visible:ring-primary/50 [field-sizing:fixed] max-h-[380px] min-h-[220px] resize-y overflow-y-auto font-mono text-xs text-white'
                                                />
                                            </FormControl>
                                        ) : (
                                            <HtmlEmailPreview
                                                subject={form.watch('subject')}
                                                body={field.value}
                                                channel={template?.channel ?? 'email'}
                                                height={340}
                                            />
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='is_active'
                                render={({ field }) => (
                                    <FormItem className='border-slr-navy-border bg-slr-navy-card/40 flex items-center justify-between rounded-lg border p-3.5'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='cursor-pointer text-sm font-medium text-white'>
                                                Active
                                            </FormLabel>
                                            <p className='text-slr-dim text-xs'>
                                                Turning this off stops this notification from being sent at all.
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className='border-slr-navy-border bg-slr-navy-card/30 flex shrink-0 items-center justify-end gap-2 border-t p-4 pt-3 sm:p-6 sm:pt-4'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                                className='border-slr-navy-border text-white hover:bg-white/10'>
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={isSaving || !form.formState.isDirty}
                                className='bg-primary text-primary-foreground font-semibold hover:opacity-90'>
                                {isSaving ? 'Saving…' : 'Save template'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
