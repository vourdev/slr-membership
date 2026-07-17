'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import EmptyState from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import type { DrawCsvHistoryItem, DrawCsvTier } from '@/lib/api/resources/admin';
import { cn } from '@/lib/utils';

import { generateDrawCsvAction } from './actions';
import { Download, FileSpreadsheet, Loader2Icon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const TIER_STYLE: Record<DrawCsvTier, string> = {
    visitor: 'border-[#A0B4D259] text-slr-dim',
    red: 'border-[#C8152E66] text-[#E88888]',
    blue: 'border-[#2878E84D] text-[#2878E8]'
};

function formatDate(value: string): string {
    if (!value) return '-';
    const d = new Date(value);

    return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-AU');
}

interface DrawExportsClientProps {
    initialHistory: DrawCsvHistoryItem[];
    failed: boolean;
}

export function DrawExportsClient({ initialHistory, failed }: DrawExportsClientProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const generate = () => {
        startTransition(async () => {
            const res = await generateDrawCsvAction();
            if (res.ok) {
                const total = res.data.files.reduce((sum, f) => sum + (f.row_count ?? 0), 0);
                toast.success(`${res.data.files.length} CSV files generated — ${total} rows total.`);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className='flex w-full flex-col gap-6 px-4 py-6'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
                <Heading
                    title='Draw Exports'
                    description='Generate the 3 TPAL entry CSVs (Visitor, Red, Blue), then upload them to randomdraws.com/au to run the draw.'
                />
                <Button onClick={generate} disabled={pending}>
                    {pending ? <Loader2Icon className='mr-2 size-4 animate-spin' /> : <RefreshCw className='mr-2 size-4' />}
                    Generate CSVs
                </Button>
            </div>

            {failed ? (
                <EmptyState
                    icon={FileSpreadsheet}
                    title='Export History Unavailable'
                    description='We couldn’t load the CSV generation history right now. Please try again.'
                />
            ) : initialHistory.length === 0 ? (
                <EmptyState
                    icon={FileSpreadsheet}
                    title='No exports yet'
                    description='Generate the entry CSVs to start a draw. Each run produces one file per tier, containing only members with entries in the current cycle.'
                />
            ) : (
                <div className='rounded-xl border border-white/10 bg-white/5 p-6'>
                    {/* The API re-signs each download_url on every read, so links are valid ~1h from page load. */}
                    <p className='text-slr-dim mb-4 text-xs'>
                        Download links stay valid for about an hour — reload this page if one expires. Upload these to
                        randomdraws.com/au to run the draw, then record the winners.
                    </p>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='text-slr-dim border-b border-white/10 text-left text-xs uppercase'>
                                    <th className='px-3 py-3 font-medium'>Tier</th>
                                    <th className='px-3 py-3 font-medium'>Filename</th>
                                    <th className='px-3 py-3 font-medium'>Rows</th>
                                    <th className='px-3 py-3 font-medium'>Generated</th>
                                    <th className='px-3 py-3 text-right font-medium'>Download</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-white/5'>
                                {initialHistory.map((row) => (
                                    <tr key={row.id} className='transition-colors hover:bg-white/5'>
                                        <td className='px-3 py-4'>
                                            <span
                                                className={cn(
                                                    'rounded-md border px-2 py-0.5 text-xs font-semibold uppercase',
                                                    TIER_STYLE[row.tier]
                                                )}>
                                                {row.tier || '-'}
                                            </span>
                                        </td>
                                        <td className='px-3 py-4 font-medium text-white'>{row.filename || '-'}</td>
                                        <td className='px-3 py-4 text-white/90 tabular-nums'>{row.row_count ?? 0}</td>
                                        <td className='px-3 py-4 text-white/60'>{formatDate(row.generated_at)}</td>
                                        <td className='px-3 py-4 text-right'>
                                            {row.download_url ? (
                                                <Button variant='ghost' size='sm' className='h-8' asChild>
                                                    <a href={row.download_url} download>
                                                        <Download className='mr-1.5 size-3.5' />
                                                        CSV
                                                    </a>
                                                </Button>
                                            ) : (
                                                <span className='text-slr-dim'>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
