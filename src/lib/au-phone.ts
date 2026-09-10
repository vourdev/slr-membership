/**
 * Australian phone helpers — the single rule for every phone field.
 *
 * The BENY add-on is activated by hand in BENY's own portal using the member's phone number,
 * so a badly formatted number means the member pays and never gets access. The API does not
 * validate phones at all, so these are the only guard there is.
 */

/** Digits only, with a leading "+" preserved so 0011/+61 prefixes can be told apart. */
const clean = (value: string): string => value.replace(/[^\d+]/g, '');

/** Mobiles are 04xxxxxxxx; landlines and 1300/1800 services are the other accepted shapes. */
const LOCAL = /^0[2-478]\d{8}$/;
const INTERNATIONAL = /^\+61[2-478]\d{8}$/;
const SERVICE = /^1[38]00\d{6}$/;

export function isAuPhone(value: string): boolean {
    const digits = clean(value);

    return LOCAL.test(digits) || INTERNATIONAL.test(digits) || SERVICE.test(digits);
}

/** "0412 345 678" -> "+61412345678". Returns the cleaned input when it is not a local number. */
export function toAuE164(value: string): string {
    const digits = clean(value);
    if (LOCAL.test(digits)) return `+61${digits.slice(1)}`;

    return digits;
}

export const AU_PHONE_MESSAGE = 'Enter a valid Australian phone number, e.g. 0412 345 678';

/** Digits allowed after a "+61" prefix, e.g. "412345678". */
export const AU_NATIONAL_LENGTH = 9;

/**
 * Normalises anything a member pastes into the national part shown beside a "+61" prefix:
 * "0412 345 678", "+61412345678" and "61412345678" all become "412345678".
 *
 * Deliberately does not truncate. An already-stored bad number has to stay visible so
 * validation rejects it — silently trimming it to nine digits would save a plausible-looking
 * number that BENY activation would then dial wrongly.
 */
export function toAuNational(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    const national = digits.startsWith('61') ? digits.slice(2) : digits;

    return national.replace(/^0+/, '');
}

/** Validates the national part on its own, for inputs that render "+61" as a fixed prefix. */
export function isAuNational(national: string): boolean {
    return isAuPhone(`+61${national}`);
}
