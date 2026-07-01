'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { goldButtonStyle, inputClassName } from '@/lib/styles';
import { cn } from '@/lib/utils';

import { Check, EyeIcon, EyeOffIcon } from 'lucide-react';

function PasswordInput({
    value,
    onChange,
    placeholder,
    autoComplete
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    autoComplete: string;
}) {
    const [show, setShow] = useState(false);

    return (
        <div className='relative isolate'>
            <Input
                required
                type={show ? 'text' : 'password'}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(inputClassName, 'pr-10')}
            />
            <button
                type='button'
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-white/50 transition-colors hover:text-white focus:outline-none'>
                {show ? <EyeOffIcon className='h-4 w-4' /> : <EyeIcon className='h-4 w-4' />}
            </button>
        </div>
    );
}

export function SecuritySection() {
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (pw.next.length < 8) {
            setError('New password must be at least 8 characters.');

            return;
        }
        if (pw.next !== pw.confirm) {
            setError('New passwords do not match.');

            return;
        }

        // Mock — real flow calls the Express auth API.
        setSaved(true);
        setPw({ current: '', next: '', confirm: '' });
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>Security</h2>

            <form onSubmit={submit} className='mt-4 space-y-3 border-t border-white/5 pt-4'>
                <p className='text-slr-dim text-xs tracking-widest uppercase'>Change password</p>
                <PasswordInput
                    value={pw.current}
                    onChange={(v) => setPw({ ...pw, current: v })}
                    placeholder='Current password'
                    autoComplete='current-password'
                />
                <PasswordInput
                    value={pw.next}
                    onChange={(v) => setPw({ ...pw, next: v })}
                    placeholder='New password'
                    autoComplete='new-password'
                />
                <PasswordInput
                    value={pw.confirm}
                    onChange={(v) => setPw({ ...pw, confirm: v })}
                    placeholder='Confirm new password'
                    autoComplete='new-password'
                />
                {error && <p className='text-sm text-red-400'>{error}</p>}
                {saved && (
                    <p className='inline-flex items-center gap-1.5 text-sm text-emerald-400'>
                        <Check className='size-4' /> Password updated.
                    </p>
                )}
                <button
                    type='submit'
                    className='inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold uppercase'
                    style={goldButtonStyle}>
                    Update password
                </button>
            </form>
        </section>
    );
}
