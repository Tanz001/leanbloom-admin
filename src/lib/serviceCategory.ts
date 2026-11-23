/** MyDose care categories stored in products.description for seeded services. */
export const CARE_CATEGORIES = [
  'Weight Loss',
  'Sleep',
  'Energy',
  'Recovery',
  'Focus',
  'Performance',
  'Immunity',
  'Longevity',
  'Hormones-Men',
  'Hormones-Women',
  'Gut Health',
  'Sexual Health',
] as const;

export type CareCategory = (typeof CARE_CATEGORIES)[number];

export function serviceCategoryOf(product: {
  description?: string | null;
  category?: string | null;
}): string {
  const care = (product.description || '').trim();
  if (
    CARE_CATEGORIES.includes(care as CareCategory) ||
    (care.length > 0 && care.length <= 40 && !care.includes('.'))
  ) {
    return care;
  }
  return product.category || '—';
}

export const MYDOSE_GENERAL_SERVICES_URL = 'https://app.mydose.ai/s/ny28qgc';
