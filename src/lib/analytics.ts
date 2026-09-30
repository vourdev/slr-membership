import type { SubTierCode } from '@/types/member';
import { sendGTMEvent } from '@next/third-parties/google';

/**
 * Sign-up funnel events pushed to the GTM dataLayer.
 *
 * Deliberately no email, name, phone or date of birth: Google's terms forbid uploading data that
 * can identify an individual, and a GA4 property that receives it can be terminated. `state` is a
 * coarse region (one of eight), which is why it is safe to send.
 */
export type SignUpEvent =
    | { event: 'sign_up_account_completed'; state: string }
    | { event: 'sign_up_tier_selected'; tier: string; sub_tier: SubTierCode }
    | {
          event: 'sign_up_checkout_initiated';
          tier: string;
          sub_tier: SubTierCode;
          subtotal: number;
          discount: number;
      }
    | { event: 'sign_up_payment_success' };

export function trackSignUp(payload: SignUpEvent): void {
    if (typeof window === 'undefined') return;

    sendGTMEvent(payload);
}
