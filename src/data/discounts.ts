// Static marketing categories shown for the BENY add-on (not from BENY's system).
// Live partner discounts + BENY status now come from the API (resources/discounts,
// resources/beny) — the former mock getters/records were removed.
export const BENY_CATEGORIES = [
    'Petrol Saving',
    'Retail Partner Discounts',
    'Lifestyle Offers',
    'Health & Wellbeing'
] as const;
