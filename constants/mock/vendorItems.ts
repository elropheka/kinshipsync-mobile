export const VENDOR_ITEM_AVAILABILITY_OPTIONS = [
  'Available',
  'Unavailable',
  'In Stock',
  'Out of Stock',
  'Custom Order',
] as const;

export type VendorItemAvailabilityOption = (typeof VENDOR_ITEM_AVAILABILITY_OPTIONS)[number];
