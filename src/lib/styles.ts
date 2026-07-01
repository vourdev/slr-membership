import type { CSSProperties } from 'react';

/**
 * SLR brand gold gradient (89.12°). Single source of truth for inline `style`
 * usages. For className contexts prefer the `bg-gradient-gold` / `text-gradient-gold`
 * utilities in globals.css, which use the same stops.
 */
export const GOLD_GRADIENT = 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)';

/**
 * Primary gold CTA button — gold gradient fill, dark-navy text, light-gold top edge.
 * Apply to a shadcn `<Button>` via `style={goldButtonStyle}`.
 */
export const goldButtonStyle: CSSProperties = {
    color: '#0C1132',
    background: GOLD_GRADIENT,
    borderTop: '2px solid #FFDC75'
};

/** Gold gradient fill only (no text colour / top edge) — used for nav + auth CTAs. */
export const goldBgStyle: CSSProperties = {
    background: GOLD_GRADIENT
};

/**
 * Dark form-input style — matches the sign-up (register) inputs. Apply to a
 * shadcn `<Input>` / `<SelectTrigger>` via `className`. h-11, subtle glass fill,
 * gold focus ring.
 */
export const inputClassName =
    'h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20';
