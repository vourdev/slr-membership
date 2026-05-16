'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AU_STATES, AuStateCode } from '@/constant/au-states';
import { SignUpSchema } from '@/lib/zod';

import { SignUpFormData } from './types';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

type StepAccountProps = {
    data: SignUpFormData;
    onNext: (patch: Partial<SignUpFormData>) => void;
};

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'state' | 'phone', string>>;

const StepAccount = ({ data, onNext }: StepAccountProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [values, setValues] = useState({
        name: data.name,
        email: data.email,
        password: data.password,
        state: data.state,
        phone: data.phone
    });

    const update = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
        setValues((v) => ({ ...v, [key]: value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = SignUpSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                name: fieldErrors.name?.[0],
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
                state: fieldErrors.state?.[0],
                phone: fieldErrors.phone?.[0]
            });

            return;
        }
        onNext(values);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <div>
                <h2 className='font-bebas-neue text-3xl tracking-wider text-white uppercase md:text-4xl'>
                    Create your account
                </h2>
                <p className='mt-1 text-sm text-[#CDCECF]'>
                    Tell us a bit about you. We use your state to assign you to the correct draw pool.
                </p>
            </div>

            <div className='grid gap-2'>
                <Label htmlFor='name' className='text-sm font-medium text-white'>
                    Full name
                </Label>
                <Input
                    id='name'
                    type='text'
                    placeholder='Jane Smith'
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    autoComplete='name'
                    className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                />
                {errors.name && <span className='text-xs text-red-400'>{errors.name}</span>}
            </div>

            <div className='grid gap-2'>
                <Label htmlFor='email' className='text-sm font-medium text-white'>
                    Email
                </Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={values.email}
                    onChange={(e) => update('email', e.target.value)}
                    autoComplete='email'
                    className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                />
                {errors.email && <span className='text-xs text-red-400'>{errors.email}</span>}
            </div>

            <div className='grid gap-2'>
                <Label htmlFor='password' className='text-sm font-medium text-white'>
                    Password
                </Label>
                <div className='relative'>
                    <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Minimum 8 characters'
                        value={values.password}
                        onChange={(e) => update('password', e.target.value)}
                        autoComplete='new-password'
                        className='h-11 rounded-lg border-white/10 bg-white/5 pr-10 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword((s) => !s)}
                        className='absolute top-1/2 right-3 -translate-y-1/2 text-white/50 transition-colors hover:text-white focus:outline-none'
                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOffIcon className='h-4 w-4' /> : <EyeIcon className='h-4 w-4' />}
                    </button>
                </div>
                {errors.password && <span className='text-xs text-red-400'>{errors.password}</span>}
            </div>

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                <div className='grid gap-2'>
                    <Label htmlFor='state' className='text-sm font-medium text-white'>
                        State / territory
                    </Label>
                    <Select value={values.state || undefined} onValueChange={(v) => update('state', v as AuStateCode)}>
                        <SelectTrigger
                            id='state'
                            className='h-11 w-full rounded-lg border-white/10 bg-white/5 text-white focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20 data-placeholder:text-white/40'>
                            <SelectValue placeholder='Select…' />
                        </SelectTrigger>
                        <SelectContent className='border-white/10 bg-[#141820] text-white'>
                            {AU_STATES.map((s) => (
                                <SelectItem
                                    key={s.code}
                                    value={s.code}
                                    className='text-white focus:bg-white/10 focus:text-white'>
                                    {s.code} · {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.state && <span className='text-xs text-red-400'>{errors.state}</span>}
                </div>

                <div className='grid gap-2'>
                    <Label htmlFor='phone' className='text-sm font-medium text-white'>
                        Phone
                    </Label>
                    <Input
                        id='phone'
                        type='tel'
                        placeholder='04xx xxx xxx'
                        value={values.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        autoComplete='tel'
                        className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                    />
                    {errors.phone && <span className='text-xs text-red-400'>{errors.phone}</span>}
                </div>
            </div>

            <Button
                type='submit'
                style={goldButtonStyle}
                className='mt-2 h-11 w-full rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90'>
                Continue
            </Button>
        </form>
    );
};

export default StepAccount;
