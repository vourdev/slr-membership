'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import { Check, Eye, Monitor, Smartphone, Sparkles } from 'lucide-react';

export const SAMPLE_VARIABLES: Record<string, string> = {
    '{{full_name}}': 'Alex Johnson',
    '{{first_name}}': 'Alex',
    '{{tier}}': 'SLR RED (R4)',
    '{{sub_tier}}': 'R4',
    '{{discount}}': '$10 OFF',
    '{{discount_cents}}': '$10.00',
    '{{otp_code}}': '849201',
    '{{reset_url}}': 'https://smartliferewards.com.au/reset-password?token=sample_token_849201',
    '{{email}}': 'alex.johnson@example.com',
    '{{last_name}}': 'Johnson',
    '{{draw_name}}': 'Weekly Ford Ranger Raptor Giveaway'
};

export function buildPreviewHtml(body: string, useSampleData: boolean): string {
    let content = body || '';
    if (useSampleData) {
        for (const [placeholder, value] of Object.entries(SAMPLE_VARIABLES)) {
            content = content.replaceAll(placeholder, value);
        }
    }

    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    const bodyContent = isHtml
        ? content
        : `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; white-space: pre-wrap; color: #1f2937; line-height: 1.6; padding: 4px;">${content}</div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #1f2937;
      line-height: 1.5;
      word-break: break-word;
    }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; max-width: 100%; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

export function HtmlEmailPreview({
    subject,
    body,
    channel = 'email',
    className,
    height = 360
}: {
    subject?: string;
    body: string;
    channel?: string;
    className?: string;
    height?: number | string;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [useSampleData, setUseSampleData] = useState(true);

    const previewSubject = useMemo(() => {
        let s = subject || '';
        if (useSampleData) {
            for (const [placeholder, value] of Object.entries(SAMPLE_VARIABLES)) {
                s = s.replaceAll(placeholder, value);
            }
        }

        return s;
    }, [subject, useSampleData]);

    const previewHtml = useMemo(() => buildPreviewHtml(body, useSampleData), [body, useSampleData]);

    return (
        <div
            className={cn(
                'border-slr-navy-border flex flex-col overflow-hidden rounded-xl border bg-slate-950',
                className
            )}>
            {/* Toolbar */}
            <div className='border-slr-navy-border bg-slr-navy-card/60 flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-xs'>
                <div className='flex items-center gap-2'>
                    <span className='flex items-center gap-1.5 font-medium text-white'>
                        <Eye className='size-3.5 text-amber-400' />
                        HTML {channel === 'sms' ? 'SMS' : 'Email'} Preview
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    {/* Sample data toggle */}
                    <button
                        type='button'
                        onClick={() => setUseSampleData((v) => !v)}
                        className={cn(
                            'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                            useSampleData
                                ? 'border border-amber-500/40 bg-amber-500/10 text-amber-300'
                                : 'text-slr-dim hover:bg-white/5 hover:text-white'
                        )}
                        title='Toggle filling sample values into {{placeholders}}'>
                        <Sparkles className='size-3' />
                        Sample data {useSampleData ? 'ON' : 'OFF'}
                    </button>

                    {/* Device selector */}
                    <div className='border-slr-navy-border bg-slr-navy-deep flex items-center rounded-md border p-0.5'>
                        <button
                            type='button'
                            onClick={() => setIsMobile(false)}
                            className={cn(
                                'flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors',
                                !isMobile ? 'bg-white/20 text-white' : 'text-slr-dim hover:text-white'
                            )}
                            title='Desktop preview'>
                            <Monitor className='size-3' />
                            Desktop
                        </button>
                        <button
                            type='button'
                            onClick={() => setIsMobile(true)}
                            className={cn(
                                'flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors',
                                isMobile ? 'bg-white/20 text-white' : 'text-slr-dim hover:text-white'
                            )}
                            title='Mobile preview (375px)'>
                            <Smartphone className='size-3' />
                            Mobile
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Header Metadata Envelope */}
            {channel !== 'sms' && (
                <div className='border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-xs text-slate-700 select-none'>
                    <div className='grid grid-cols-[55px_1fr] items-center gap-2 py-0.5'>
                        <span className='font-semibold text-slate-500'>From:</span>
                        <span className='truncate font-medium text-slate-900'>
                            Smart Life Rewards &lt;noreply@smartliferewards.com.au&gt;
                        </span>
                    </div>
                    <div className='grid grid-cols-[55px_1fr] items-center gap-2 py-0.5'>
                        <span className='font-semibold text-slate-500'>To:</span>
                        <span className='truncate font-medium text-slate-800'>
                            {useSampleData ? 'Alex Johnson <alex.johnson@example.com>' : '{{full_name}} <{{email}}>'}
                        </span>
                    </div>
                    <div className='grid grid-cols-[55px_1fr] items-center gap-2 py-0.5'>
                        <span className='font-semibold text-slate-500'>Subject:</span>
                        <span className='truncate font-bold text-slate-900'>
                            {previewSubject || <span className='font-normal text-slate-400 italic'>No subject</span>}
                        </span>
                    </div>
                </div>
            )}

            {/* Content Body Preview Area */}
            <div
                className={cn(
                    'flex items-center justify-center overflow-auto bg-slate-800/40 p-2 sm:p-4',
                    isMobile ? 'py-4' : 'p-2'
                )}>
                <div
                    className={cn(
                        'w-full overflow-hidden bg-white shadow-md transition-all duration-200',
                        isMobile
                            ? 'max-w-[375px] rounded-3xl border-8 border-slate-900 shadow-2xl ring-1 ring-white/10'
                            : 'rounded-md border border-slate-300'
                    )}>
                    {isMobile && (
                        <div className='flex h-5 items-center justify-center bg-slate-900'>
                            <div className='h-1.5 w-12 rounded-full bg-slate-700' />
                        </div>
                    )}
                    <iframe
                        srcDoc={previewHtml}
                        title='HTML Preview'
                        className='w-full border-0 bg-white'
                        style={{ height }}
                        sandbox='allow-same-origin'
                    />
                </div>
            </div>
        </div>
    );
}
