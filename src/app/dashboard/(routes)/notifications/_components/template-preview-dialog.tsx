'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import type { NotificationTemplate } from '@/types/member';

import { HtmlEmailPreview } from './html-email-preview';
import { Pencil } from 'lucide-react';

export function TemplatePreviewDialog({
    template,
    open,
    onOpenChange,
    onEdit
}: {
    template: NotificationTemplate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (template: NotificationTemplate) => void;
}) {
    if (!template) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='dashboard-theme dark border-slr-navy-border bg-slr-navy-deep flex max-h-[calc(100dvh-3rem)] flex-col overflow-hidden p-0 text-white shadow-2xl sm:max-w-3xl lg:max-w-4xl'>
                <DialogHeader className='border-slr-navy-border shrink-0 border-b p-6 pb-4 text-left'>
                    <div className='flex items-center justify-between gap-4 pr-6'>
                        <div>
                            <DialogTitle className='text-xl font-semibold text-white'>
                                {template.subject || 'Template Preview'}
                            </DialogTitle>
                            <DialogDescription className='text-slr-dim text-xs'>
                                Type: {template.type} · Channel: {template.channel} · Status:{' '}
                                {template.is_active ? 'Active' : 'Inactive'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
                    <HtmlEmailPreview
                        subject={template.subject}
                        body={template.body}
                        channel={template.channel}
                        height={460}
                    />
                </div>

                <DialogFooter className='border-slr-navy-border bg-slr-navy-card/30 flex shrink-0 items-center justify-between border-t p-4 sm:p-6 sm:py-3'>
                    <span className='text-slr-dim text-xs'>
                        Previewing how this template renders in recipient email inboxes.
                    </span>
                    <div className='flex items-center gap-2'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => onOpenChange(false)}
                            className='border-slr-navy-border text-white hover:bg-white/10'>
                            Close
                        </Button>
                        {onEdit && (
                            <Button
                                type='button'
                                onClick={() => {
                                    onOpenChange(false);
                                    onEdit(template);
                                }}
                                className='bg-primary text-primary-foreground font-semibold hover:opacity-90'>
                                <Pencil className='mr-1.5 size-3.5' />
                                Edit template
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
