import { ApiError } from '@/lib/api/types';

/**
 * The backend pins `subscription_data.trial_end` to a fixed prelaunch date and forwards
 * Stripe's rejection verbatim once that date is under 48 hours away. Stripe's wording
 * ("The `trial_end` date has to be at least 2 days in the future.") is meaningless to a
 * member, so it is matched here and replaced with something actionable.
 *
 * Remove this once the backend drops the trial when it can no longer apply — the checkout
 * then succeeds as an ordinary paid signup instead of failing.
 */
export const CHECKOUT_UNAVAILABLE_MESSAGE =
    'Sign-up is temporarily unavailable while we finish switching over from the launch offer. Please try again later, or contact support if it keeps happening.';

export function isTrialWindowError(error: unknown): boolean {
    if (!(error instanceof ApiError)) return false;

    return /trial_end/i.test(error.message);
}
