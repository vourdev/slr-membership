'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AU_NATIONAL_LENGTH, AU_PHONE_MESSAGE, isAuNational, toAuNational } from '@/lib/au-phone';
import { MIN_AGE_YEARS, isAdultDob, latestAdultDob } from '@/lib/dob';
import { formatShortDate } from '@/lib/member';
import { goldButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import type { MemberProfile } from '@/types/member';

import { updateProfileAction } from '../actions';
import { format } from 'date-fns';
import { CalendarIcon, Lock, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalInfoSectionProps {
    profile: MemberProfile;
}

const PHONE_PREFIX = '+61';

export function PersonalInfoSection({ profile }: PersonalInfoSectionProps) {
    const [editing, setEditing] = useState(false);
    const [pending, startTransition] = useTransition();
    const [fullName, setFullName] = useState(profile.name);
    const [phoneLocal, setPhoneLocal] = useState(toAuNational(profile.phone ?? ''));
    const [dob, setDob] = useState(profile.dob ? profile.dob.slice(0, 10) : '');

    const save = () => {
        if (!fullName.trim()) {
            toast.error('Name cannot be empty.');

            return;
        }
        if (!isAuNational(phoneLocal)) {
            toast.error(AU_PHONE_MESSAGE);

            return;
        }
        if (dob && !isAdultDob(dob)) {
            toast.error(`You must be at least ${MIN_AGE_YEARS} years old.`);

            return;
        }

        startTransition(async () => {
            const res = await updateProfileAction({
                fullName: fullName.trim(),
                phone: `${PHONE_PREFIX}${phoneLocal}`,
                dob
            });
            if (!res.ok) {
                toast.error(res.message);

                return;
            }
            toast.success('Profile updated.');
            setEditing(false);
        });
    };

    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <div className='mb-4 flex items-center justify-between'>
                <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>
                    Personal Info
                </h2>
                {editing ? null : (
                    <Button variant='outline' size='sm' onClick={() => setEditing(true)}>
                        <Pencil className='size-3.5' /> Edit
                    </Button>
                )}
            </div>

            <dl className='divide-y divide-white/5 text-sm'>
                <Row label='Name'>
                    {editing ? (
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={pending} />
                    ) : (
                        <span className='text-white'>{profile.name || '-'}</span>
                    )}
                </Row>
                <Row label='Phone'>
                    {editing ? (
                        <div className='flex w-full items-center gap-2'>
                            <span className='border-slr-navy-border text-slr-muted shrink-0 rounded-md border bg-white/5 px-2.5 py-2 text-sm'>
                                {PHONE_PREFIX}
                            </span>
                            <Input
                                value={phoneLocal}
                                onChange={(e) =>
                                    setPhoneLocal(toAuNational(e.target.value).slice(0, AU_NATIONAL_LENGTH))
                                }
                                maxLength={AU_NATIONAL_LENGTH}
                                disabled={pending}
                                type='tel'
                                inputMode='numeric'
                                autoComplete='tel-national'
                                placeholder='400000000'
                                aria-label='Phone number without country code'
                            />
                        </div>
                    ) : (
                        <span className='text-white'>{profile.phone || '-'}</span>
                    )}
                </Row>
                <Row label='Email'>
                    <span className='text-white/90'>{profile.email || '-'}</span>
                    <span className='text-slr-dim ml-2 inline-flex items-center gap-1 text-xs'>
                        <Lock className='size-3' />
                    </span>
                </Row>
                <Row label='Address (State)'>
                    <span className='text-white/90'>{profile.state || '-'}</span>
                    <span className='text-slr-dim ml-2 inline-flex items-center gap-1 text-xs'>
                        <Lock className='size-3' />
                    </span>
                </Row>
                <Row label='Date of Birth'>
                    {editing ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type='button'
                                    variant='outline'
                                    disabled={pending}
                                    aria-label='Date of birth'
                                    className={cn(
                                        'h-9 w-full justify-between px-3 font-normal',
                                        !dob && 'text-white/40'
                                    )}>
                                    {dob ? format(new Date(dob), 'dd/MM/yyyy') : <span>Select date…</span>}
                                    <CalendarIcon className='h-4 w-4 text-white/50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto border-white/10 bg-[#141820] p-0 text-white' align='end'>
                                <Calendar
                                    mode='single'
                                    captionLayout='dropdown'
                                    selected={dob ? new Date(dob) : undefined}
                                    defaultMonth={dob ? new Date(dob) : undefined}
                                    onSelect={(date) => setDob(date ? format(date, 'yyyy-MM-dd') : '')}
                                    disabled={{ after: latestAdultDob() }}
                                    startMonth={new Date(1900, 0)}
                                    endMonth={latestAdultDob()}
                                    className='bg-[#141820] text-white'
                                />
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <span className='text-white/90'>{profile.dob ? formatShortDate(profile.dob) : '-'}</span>
                    )}
                </Row>
            </dl>

            {editing ? (
                <div className='mt-4 flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setEditing(false)} disabled={pending}>
                        Cancel
                    </Button>
                    <Button
                        className='rounded-xl font-bold uppercase'
                        style={goldButtonStyle}
                        onClick={save}
                        disabled={pending}>
                        {pending ? 'Saving…' : 'Save changes'}
                    </Button>
                </div>
            ) : null}
        </section>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='flex flex-wrap items-center justify-between gap-2 py-3'>
            <dt className='text-slr-muted'>{label}</dt>
            <dd className='flex min-w-[55%] items-center justify-end text-right'>{children}</dd>
        </div>
    );
}
