'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatShortDate } from '@/lib/member';
import type { MemberProfile } from '@/types/member';

import { updateProfileAction } from '../actions';
import { Lock, Pencil } from 'lucide-react';
import { toast } from 'sonner';

// Placeholder = backend has no field/self-edit yet (see docs/BACKEND-ISSUES.md).
function Placeholder() {
    return (
        <span className='ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-400 uppercase'>
            Placeholder
        </span>
    );
}

interface PersonalInfoSectionProps {
    profile: MemberProfile;
}

export function PersonalInfoSection({ profile }: PersonalInfoSectionProps) {
    const [editing, setEditing] = useState(false);
    const [pending, startTransition] = useTransition();
    const [fullName, setFullName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone ?? '');

    const save = () => {
        startTransition(async () => {
            const res = await updateProfileAction({ fullName, phone });
            if (res.ok) {
                toast.success('Profile updated.');
                setEditing(false);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
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
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={pending} />
                    ) : (
                        <span className='text-white'>{profile.phone || '-'}</span>
                    )}
                </Row>
                <Row label='Email'>
                    <span className='text-white/90'>{profile.email || '-'}</span>
                    <span className='text-slr-dim ml-2 inline-flex items-center gap-1 text-xs'>
                        <Lock className='size-3' /> admin approval
                    </span>
                </Row>
                <Row label='Address (State)'>
                    <span className='text-white/90'>{profile.state || '-'}</span>
                    <span className='text-slr-dim ml-2 inline-flex items-center gap-1 text-xs'>
                        <Lock className='size-3' /> admin approval
                    </span>
                </Row>
                <Row label='Date of Birth'>
                    <span className='text-white/90'>{profile.dob ? formatShortDate(profile.dob) : '-'}</span>
                </Row>
                <Row label='Pay-ID Email'>
                    <span className='text-white/60'>{profile.pay_id_email || '-'}</span>
                    <Placeholder />
                </Row>
            </dl>

            {editing ? (
                <div className='mt-4 flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setEditing(false)} disabled={pending}>
                        Cancel
                    </Button>
                    <Button onClick={save} disabled={pending}>
                        {pending ? 'Saving…' : 'Save changes'}
                    </Button>
                </div>
            ) : null}

            <p className='text-slr-dim mt-4 text-xs'>
                Email and state changes require admin approval — contact support to request one.
            </p>
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
