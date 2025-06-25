export interface VendorCategory {
  id: string;
  name: string;
  slug: string; // for URL routing, e.g., "photographers", "caterers"
  description?: string;
  iconUrl?: string; // Optional icon for the category
  parentCategoryId?: string; // For sub-categories
}

export interface Vendor {
  id: string;
  name: string;
  name_lowercase?: string; // For case-insensitive search
  description: string;
  categories: VendorCategory[]; // Could also be string[] of category IDs/slugs
  contactEmail?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  portfolioImageUrls?: string[];
  logoUrl?: string;
  averageRating?: number; // e.g., 4.5
  numberOfReviews?: number;
  servicesOffered?: string[]; // List of specific services
  pricingInfo?: string; // e.g., "Starts at $X", "Packages available"
  operatingHours?: string; // e.g., "Mon-Fri: 9am-5pm"
  isFeatured?: boolean;
  // Fields for vendor management by event planners
  associatedEventIds?: string[]; // Events this vendor is linked to
  notesForEventPlanner?: string; // Specific notes for an event
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// For creating/updating, we might simplify or have specific payloads
export interface CreateVendorPayload extends Omit<Vendor, 'id' | 'averageRating' | 'numberOfReviews' | 'createdAt' | 'updatedAt' | 'associatedEventIds'> {}
export interface UpdateVendorPayload extends Partial<CreateVendorPayload> {}


export interface VendorReview {
  id: string;
  vendorId: string;
  userId: string; // User who wrote the review
  rating: number; // e.g., 1-5
  comment?: string;
  reviewDate: string; // ISO 8601
  // replies?: VendorReviewReply[]; // If vendors can reply
}
export interface CreateVendorReviewPayload extends Omit<VendorReview, 'id' | 'reviewDate' | 'userId'> {}
// Update for reviews might be limited or not allowed depending on policy

// Payloads for searching/filtering vendors
export interface VendorSearchParams {
  categorySlug?: string;
  location?: string; // e.g., city or postal code
  keyword?: string;
  minRating?: number;
  sortBy?: 'rating' | 'name' | 'featured' | 'newest';
  page?: number;
  limit?: number;
}
