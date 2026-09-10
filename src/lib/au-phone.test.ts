import { isAuNational, isAuPhone, toAuE164, toAuNational } from '@/lib/au-phone';

import { describe, expect, it } from 'vitest';

describe('isAuPhone', () => {
    it('accepts local mobiles and landlines, spaced or not', () => {
        for (const v of ['0412345678', '0412 345 678', '(02) 9876 5432', '0398765432']) expect(isAuPhone(v)).toBe(true);
    });
    it('accepts +61 international form', () => {
        expect(isAuPhone('+61412345678')).toBe(true);
        expect(isAuPhone('+61 412 345 678')).toBe(true);
    });
    it('accepts 1300/1800 service numbers', () => {
        expect(isAuPhone('1300123456')).toBe(true);
    });
    it('rejects the shapes that would break BENY activation', () => {
        for (const v of ['', '12345', '0512345678', '628212988882', '+1 415 555 0123', '04123456789'])
            expect(isAuPhone(v)).toBe(false);
    });
});

describe('toAuE164', () => {
    it('converts local to +61', () => {
        expect(toAuE164('0412 345 678')).toBe('+61412345678');
    });
    it('leaves an already-international number alone', () => {
        expect(toAuE164('+61412345678')).toBe('+61412345678');
    });
});

describe('toAuNational', () => {
    it('normalises every shape a member might paste into the +61 field', () => {
        for (const v of ['0412345678', '0412 345 678', '+61412345678', '61412345678', '412345678'])
            expect(toAuNational(v)).toBe('412345678');
    });
    it('keeps an over-long stored number intact so validation can reject it', () => {
        expect(toAuNational('041269696969')).toBe('41269696969');
        expect(isAuNational(toAuNational('041269696969'))).toBe(false);
    });
    it('handles an empty value', () => {
        expect(toAuNational('')).toBe('');
    });
});

describe('isAuNational', () => {
    it('accepts a valid national part', () => {
        expect(isAuNational('412345678')).toBe(true);
        expect(isAuNational('298765432')).toBe(true);
    });
    it('rejects the loose lengths the old profile rule allowed', () => {
        // 6-13 digits used to pass here, which is how "+6141269696969" got saved.
        for (const v of ['412345', '41234567', '4123456789', '41269696969', '']) expect(isAuNational(v)).toBe(false);
    });
});
