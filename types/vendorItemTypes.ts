// Defines the structure for an item or service offered by a vendor.

export interface VendorItem {
  id: string; // Unique identifier for the item
  vendorId: string; // Identifier of the vendor offering this item
  name: string; // Name of the item or service
  description: string; // Detailed description
  price: number | string; // Can be a fixed number or a string like "Contact for quote", "$50/hr"
  category: string; // Category of the item/service (e.g., "Main Course", "Decor", "Music Band")
  imageUrl?: string; // Optional URL for an image of the item/service
  availability?: 'In Stock' | 'Out of Stock' | 'Custom Order' | 'Available' | 'Unavailable' | string; // Availability status
  location?: string; // Location where this item/service is available or applicable (e.g., "Accra Only", "Online")
  // Additional fields can be added as needed, e.g.:
  // unit?: string; // e.g., "per person", "per hour", "per item"
  // duration?: string; // e.g., "2 hours", "Full Day"
  // options?: Array<{ name: string; values: string[] }>; // For variants like size, color
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

// Payload for creating a new vendor item (omitting id, vendorId, createdAt, updatedAt as they are usually set by the backend/service)
export type CreateVendorItemPayload = Omit<VendorItem, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>;

// Payload for updating an existing vendor item (all fields optional)
export type UpdateVendorItemPayload = Partial<CreateVendorItemPayload>;

// For searching/filtering vendor items
export interface VendorItemSearchParams {
  vendorCategorySlug?: string; // To filter by the category of the vendor
  category?: string; // Item's own category
  vendorId?: string; // Filter by specific vendor
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest' | 'rating'; // 'rating' would imply fetching vendor rating
  page?: number;
  limit?: number;
}
