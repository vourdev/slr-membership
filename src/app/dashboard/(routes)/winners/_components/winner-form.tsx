'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TIER_VISUALS } from '@/constant/tiers';
import type { AdminGiveawayTier, AdminWinnerPayload } from '@/lib/api/resources/giveaways';
import { tierGroupFromApi } from '@/lib/api/resources/giveaways';
import { zodResolver } from '@hookform/resolvers/zod';

import { createWinnerAction, updateWinnerAction } from '../../giveaways/actions';
import type { WinnerMemberOption } from '../actions';
import { MemberPickerDialog } from './member-picker-dialog';
import { ArrowLeft, Loader2Icon, UserSearch } from 'lucide-react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type WinnerMode = 'member' | 'manual';

const formSchema = z
    .object({
        giveawayId: z.string().min(1, 'Giveaway is required'),
        mode: z.enum(['member', 'manual']),
        userId: z.string(),
        winnerName: z.string(),
        prize: z.string().min(1, 'Prize is required')
    })
    .superRefine((values, ctx) => {
        if (values.mode === 'member' && !values.userId) {
            ctx.addIssue({ code: 'custom', path: ['userId'], message: 'Member is required' });
        }
        if (values.mode === 'manual' && !values.winnerName.trim()) {
            ctx.addIssue({ code: 'custom', path: ['winnerName'], message: 'Winner name is required' });
        }
    });

type FormValues = z.infer<typeof formSchema>;

export interface WinnerFormInitialData {
    winnerId: string;
    giveawayId: string;
    userId: string;
    prize: string;

    winnerName?: string;
    memberName?: string;
    memberState?: string;
}

export interface GiveawayOption {
    id: string;
    label: string;
    tier: AdminGiveawayTier;

    opens: string;
    closes: string;
    draws: string;
}

export function WinnerForm({
    giveaways,
    initialData,
    defaultGiveawayId
}: {
    giveaways: GiveawayOption[];
    initialData?: WinnerFormInitialData;
    defaultGiveawayId?: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const title = initialData ? 'Edit Winner' : 'Record Winner';
    const description = initialData
        ? 'Correct a recorded draw result'
        : 'Record the result of a draw run at randomdraws.com/au';

    // A record with a free-text name and no member reopens in manual mode.
    const initialMode: WinnerMode = initialData && !initialData.userId && initialData.winnerName ? 'manual' : 'member';

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: initialData
            ? {
                  giveawayId: initialData.giveawayId,
                  mode: initialMode,
                  userId: initialData.userId,
                  winnerName: initialData.winnerName ?? '',
                  prize: initialData.prize
              }
            : { giveawayId: defaultGiveawayId ?? '', mode: 'member', userId: '', winnerName: '', prize: '' }
    });

    const [pendingValues, setPendingValues] = useState<FormValues | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [member, setMember] = useState<WinnerMemberOption | null>(
        initialData?.memberName
            ? {
                  id: initialData.userId,
                  name: initialData.memberName,
                  email: '-',
                  state: initialData.memberState || '-',
                  status: '-'
              }
            : null
    );

    const submit = (values: FormValues) => {
        startTransition(async () => {
            const payload: AdminWinnerPayload =
                values.mode === 'manual'
                    ? {
                          giveaway_id: values.giveawayId,
                          winner_name: values.winnerName.trim(),
                          prize: values.prize
                      }
                    : {
                          giveaway_id: values.giveawayId,
                          user_id: values.userId,
                          prize: values.prize
                      };

            try {
                const res = initialData
                    ? await updateWinnerAction(initialData.winnerId, payload)
                    : await createWinnerAction(payload);

                setPendingValues(null);

                if (res.ok) {
                    toast.success(res.message);
                    router.push('/dashboard/winners');
                    router.refresh();
                } else {
                    toast.error(res.message);
                }
            } catch {
                setPendingValues(null);
                toast.error('Something went wrong. Please try again.');
            }
        });
    };

    const onSubmit = (values: FormValues) => (initialData ? submit(values) : setPendingValues(values));

    const giveawayById = (id: string) => giveaways.find((g) => g.id === id);
    const giveawayLabel = (id: string) => {
        const g = giveawayById(id);

        return g ? `${g.label} (${g.tier})` : id;
    };

    const mode = form.watch('mode');
    const selectedGiveawayId = form.watch('giveawayId');
    const selectedGiveaway = giveawayById(selectedGiveawayId);
    const selectedGroup = selectedGiveaway ? tierGroupFromApi(selectedGiveaway.tier) : null;

    return (
        <div className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6'>
            <div className='flex items-center gap-4'>
                <Button variant='outline' size='icon' asChild>
                    <Link href='/dashboard/winners'>
                        <ArrowLeft className='h-4 w-4' />
                    </Link>
                </Button>
                <Heading title={title} description={description} />
            </div>

            <div className='rounded-xl border border-white/10 bg-white/5 p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                        <FormField
                            control={form.control}
                            name='giveawayId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giveaway</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={(next) => {
                                            if (next !== field.value) {
                                                setMember(null);
                                                form.setValue('userId', '');
                                            }
                                            field.onChange(next);
                                        }}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select the giveaway that was drawn'>
                                                    {selectedGiveaway
                                                        ? `${selectedGiveaway.label} (${selectedGiveaway.tier}) · draw ${selectedGiveaway.draws}`
                                                        : null}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='dashboard-theme dark'>
                                            {giveaways.map((g) => (
                                                <SelectItem key={g.id} value={g.id}>
                                                    <span className='flex flex-col gap-0.5 py-0.5'>
                                                        <span className='font-medium text-white'>
                                                            {g.label} ({g.tier})
                                                        </span>
                                                        <span className='text-slr-dim text-xs'>
                                                            Start {g.opens} · End {g.closes} · Draw {g.draws}
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='mode'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Winner source</FormLabel>
                                    <FormControl>
                                        <ToggleGroup
                                            type='single'
                                            value={field.value}
                                            onValueChange={(next) => {
                                                if (!next) return;
                                                field.onChange(next);
                                                form.clearErrors(['userId', 'winnerName']);
                                            }}
                                            className='justify-start'>
                                            <ToggleGroupItem value='member' className='px-4'>
                                                From draw pool
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value='manual' className='px-4'>
                                                Enter name manually
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                    <FormDescription>
                                        Pick a member from this giveaway’s draw pool, or type the winner’s name the same
                                        way you type the prize.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* Both branches need a key: without one React reuses the same Controller
                            instance across the swap and the new field's errors never render. */}
                        <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-2'>
                            {mode === 'manual' ? (
                                <FormField
                                    key='winnerName'
                                    control={form.control}
                                    name='winnerName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Winner name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Jane Doe' {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Recorded as typed. No member is linked to this result.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    key='userId'
                                    control={form.control}
                                    name='userId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Member</FormLabel>
                                            <FormControl>
                                                <input type='hidden' {...field} />
                                            </FormControl>
                                            <div className='flex flex-col gap-2'>
                                                <div className='border-input flex min-h-11 items-center rounded-md border px-3 py-2 text-sm'>
                                                    {member ? (
                                                        <span className='flex flex-col'>
                                                            <span className='font-medium text-white'>
                                                                {member.name}
                                                            </span>
                                                            <span className='text-slr-dim text-xs'>{member.state}</span>
                                                        </span>
                                                    ) : (
                                                        <span className='text-muted-foreground'>
                                                            No member assigned
                                                        </span>
                                                    )}
                                                </div>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    disabled={!selectedGroup}
                                                    onClick={() => setPickerOpen(true)}>
                                                    <UserSearch className='mr-2 h-4 w-4' />
                                                    {member ? 'Change Member' : 'Assign Member'}
                                                </Button>
                                            </div>
                                            <FormDescription>
                                                {selectedGiveaway
                                                    ? 'Members are scoped to this giveaway’s draw pool — filter by state or search by name/email.'
                                                    : 'Select a giveaway first — the member list is scoped to its draw pool.'}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name='prize'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prize</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Toyota HiLux SR5' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            What the winner actually won. Defaults are not copied from the giveaway.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex justify-end gap-3 border-t border-white/10 pt-6'>
                            <Button variant='outline' asChild>
                                <Link href='/dashboard/winners'>Cancel</Link>
                            </Button>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> : null}
                                {initialData ? 'Save Changes' : 'Record Winner'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {selectedGroup ? (
                <MemberPickerDialog
                    open={pickerOpen}
                    onOpenChange={setPickerOpen}
                    tier={selectedGroup}
                    poolLabel={`SLR ${TIER_VISUALS[selectedGroup].poolLabel}`}
                    onSelect={(picked) => {
                        setMember(picked);
                        form.setValue('userId', picked.id, { shouldValidate: true });
                    }}
                />
            ) : null}

            <ConfirmDialog
                open={pendingValues !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingValues(null);
                }}
                className='dashboard-theme dark'
                title='Record this winner?'
                isLoading={isPending}
                confirmText='Record Winner'
                desc={
                    <span className='flex flex-col gap-2'>
                        <span>
                            This records the draw result only — it does not change the member’s entry status. Check the
                            member before continuing.
                        </span>
                        <span className='text-white/80'>
                            {giveawayLabel(pendingValues?.giveawayId ?? '')} · {pendingValues?.prize} ·{' '}
                            {pendingValues?.mode === 'manual'
                                ? pendingValues.winnerName
                                : (member?.name ?? pendingValues?.userId)}
                        </span>
                    </span>
                }
                handleConfirm={() => {
                    if (pendingValues) submit(pendingValues);
                }}
            />
        </div>
    );
}
