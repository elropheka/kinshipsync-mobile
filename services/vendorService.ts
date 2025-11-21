import axiosInstance from './axiosInstance';
import {
  Vendor, VendorCategory, VendorReview,
  CreateVendorPayload, UpdateVendorPayload,
  CreateVendorReviewPayload, VendorSearchParams
} from '../types/vendorTypes';
import {
  VendorItem,
  VendorItemSearchParams,
} from '../types/vendorItemTypes';
import { createVendorBookingNotification, createVendorReviewNotification } from '../services/notificationService';
import { getEventById } from './eventService';

// Helper to convert backend timestamps to ISO strings
const timestampToISO = (timestamp?: string | Date): string | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp.toISOString();
  return timestamp as string;
};

const dataToVendorCategory = (data: any): VendorCategory => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    iconUrl: data.iconUrl,
    parentCategoryId: data.parentCategoryId,
    createdAt: timestampToISO(data.createdAt),
    updatedAt: timestampToISO(data.updatedAt),
    isActive: data.isActive,
    displayOrder: data.displayOrder,
  } as VendorCategory;
};

const dataToVendor = (data: any): Vendor => {
  return {
    id: data.id,
    name: data.name,
    name_lowercase: data.name_lowercase,
    description: data.description,
    categories: data.categories || [],
    contactEmail: data.contactEmail,
    phoneNumber: data.phoneNumber,
    websiteUrl: data.websiteUrl,
    address: data.address,
    portfolioImageUrls: data.portfolioImageUrls,
    logoUrl: data.logoUrl,
    averageRating: data.averageRating,
    numberOfReviews: data.numberOfReviews,
    servicesOffered: data.servicesOffered,
    pricingInfo: data.pricingInfo,
    operatingHours: data.operatingHours,
    isFeatured: data.isFeatured,
    associatedEventIds: data.associatedEventIds,
    notesForEventPlanner: data.notesForEventPlanner,
    createdAt: timestampToISO(data.createdAt) || new Date().toISOString(),
    updatedAt: timestampToISO(data.updatedAt) || new Date().toISOString(),
  };
};

const dataToReview = (data: any): VendorReview => {
  return {
    id: data.id,
    vendorId: data.vendorId,
    userId: data.userId,
    rating: data.rating,
    comment: data.comment,
    reviewDate: timestampToISO(data.reviewDate) || new Date().toISOString(),
  };
};


// === Vendor Category Management ===
export const getVendorCategories = async (parentId?: string): Promise<VendorCategory[]> => {
  console.log('Service: Fetching vendor categories from backend...');
  try {
    const params = new URLSearchParams();
    if (parentId) {
      params.append('parentId', parentId);
    } else {
      params.append('topLevel', 'true');
    }
    const response = await axiosInstance.get(`/vendor-categories?${params.toString()}`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map(dataToVendorCategory);
    }
    return [];
  } catch (error) {
    console.error("Error fetching vendor categories: ", error);
    throw error;
  }
};

export const getVendorCategoryBySlug = async (slug: string): Promise<VendorCategory | null> => {
  console.log(`Service: Fetching vendor category by slug ${slug} from backend...`);
  try {
    const response = await axiosInstance.get(`/vendor-categories/slug/${slug}`);
    if (response.data.success && response.data.data) {
      return dataToVendorCategory(response.data.data);
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching category by slug ${slug}: `, error);
    throw error;
  }
};

// Admin function - not for client direct use without proper auth checks via backend/functions
export const createVendorCategory = async (payload: Omit<VendorCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<VendorCategory> => {
  try {
    const response = await axiosInstance.post('/vendor-categories', payload);
    if (response.data.success && response.data.data) {
      return dataToVendorCategory(response.data.data);
    }
    throw new Error("Failed to create vendor category.");
  } catch (error) {
    console.error("Error creating vendor category: ", error);
    throw error;
  }
};


// === Vendor Management ===
export const searchVendors = async (
  params: VendorSearchParams,
  lastVisible?: any // For pagination cursor
): Promise<{ vendors: Vendor[], total: number, lastVisible?: any }> => {
  console.log('Service: Searching vendors from backend with params:', params);
  try {
    const queryParams = new URLSearchParams();
    if (params.categorySlug) {
      queryParams.append('categorySlug', params.categorySlug);
    }
    if (params.keyword) {
      queryParams.append('keyword', params.keyword);
    }
    if (params.minRating) {
      queryParams.append('minRating', params.minRating.toString());
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (lastVisible) {
      queryParams.append('cursor', lastVisible);
    }

    const response = await axiosInstance.get(`/vendors/search?${queryParams.toString()}`);
    if (response.data.success && response.data.data) {
      return {
        vendors: (response.data.data.vendors || []).map(dataToVendor),
        total: response.data.data.total || 0,
        lastVisible: response.data.data.cursor,
      };
    }
    return { vendors: [], total: 0 };
  } catch (error) {
    console.error("Error searching vendors: ", error);
    throw error;
  }
};


export const getVendorById = async (vendorId: string): Promise<Vendor | null> => {
  console.log(`Service: Fetching vendor with id ${vendorId} from backend...`);
  try {
    const response = await axiosInstance.get(`/vendors/${vendorId}`);
    if (response.data.success && response.data.data) {
      return dataToVendor(response.data.data);
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching vendor ${vendorId}: `, error);
    throw error;
  }
};

// For admin/internal use, not typically by end-users directly without backend mediation
export const createVendor = async (payload: CreateVendorPayload): Promise<Vendor> => {
  console.log('Service: Creating vendor in backend:', payload);
  try {
    const response = await axiosInstance.post('/vendors', payload);
    if (response.data.success && response.data.data) {
      return dataToVendor(response.data.data);
    }
    throw new Error("Failed to create vendor.");
  } catch (error) {
    console.error("Error creating vendor: ", error);
    throw error;
  }
};

export const updateVendor = async (vendorId: string, payload: UpdateVendorPayload): Promise<Vendor | null> => {
  console.log(`Service: Updating vendor ${vendorId} in backend:`, payload);
  try {
    const response = await axiosInstance.put(`/vendors/${vendorId}`, payload);
    if (response.data.success && response.data.data) {
      return dataToVendor(response.data.data);
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error updating vendor ${vendorId}: `, error);
    throw error;
  }
};

// === Vendor Review Management ===
export const getReviewsForVendor = async (
  vendorId: string,
  pageSize: number = 10,
  lastReviewDoc?: any // for pagination cursor
): Promise<{ reviews: VendorReview[], total: number, lastVisible?: any }> => {
  console.log(`Service: Fetching reviews for vendor ${vendorId} from backend...`);
  try {
    const queryParams = new URLSearchParams({
      limit: pageSize.toString(),
      ...(lastReviewDoc && { cursor: lastReviewDoc }),
    });
    const response = await axiosInstance.get(`/vendors/${vendorId}/reviews?${queryParams.toString()}`);
    if (response.data.success && response.data.data) {
      return {
        reviews: (response.data.data.reviews || []).map(dataToReview),
        total: response.data.data.total || 0,
        lastVisible: response.data.data.cursor,
      };
    }
    return { reviews: [], total: 0 };
  } catch (error) {
    console.error(`Error fetching reviews for vendor ${vendorId}: `, error);
    throw error;
  }
};

export const addReviewForVendor = async (vendorId: string, userId: string, payload: CreateVendorReviewPayload): Promise<VendorReview> => {
  console.log(`Service: Adding review for vendor ${vendorId} by user ${userId} in backend:`, payload);
  try {
    const response = await axiosInstance.post(`/vendors/${vendorId}/reviews`, {
      ...payload,
      userId,
    });
    
    if (response.data.success && response.data.data) {
      const review = dataToReview(response.data.data);
      
      // Send notification for new vendor review
      const vendor = await getVendorById(vendorId);
      if (vendor && vendor.associatedEventIds && vendor.associatedEventIds.length > 0) {
        const firstAssociatedEventId = vendor.associatedEventIds[0];
        const event = await getEventById(true, firstAssociatedEventId);
        if (event) {
          createVendorReviewNotification(event.organizerId, vendor.name, `new ${payload.rating}-star review`, vendorId);
        }
      }
      
      return review;
    }
    throw new Error("Failed to add review.");
  } catch (error) {
    console.error(`Error adding review for vendor ${vendorId}: `, error);
    throw error;
  }
};


// === User's Vendor List Management ("Your Vendors") ===

// Get a user's list of vendor IDs
export const getUserVendorIds = async (userId: string): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/vendor-list`);
    if (response.data.success && response.data.data) {
      return response.data.data.vendorIds || [];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching user vendor list for ${userId}: `, error);
    throw error;
  }
};

// Get full vendor objects for a user's list
export const getUserVendors = async (userId: string): Promise<Vendor[]> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/vendor-list/vendors`);
    if (response.data.success && response.data.data) {
      return (response.data.data.vendors || []).map(dataToVendor);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching full user vendors for ${userId}: `, error);
    throw error;
  }
};

// Add a vendor to a user's list
export const addVendorToUserList = async (userId: string, vendorId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/users/${userId}/vendor-list`, { vendorId });
    
    // Send notification for vendor booking/addition to list
    const vendor = await getVendorById(vendorId);
    if (vendor) {
      createVendorBookingNotification(userId, vendor.name, 'your event', vendorId);
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      // Vendor already in list, silently return
      return;
    }
    console.error(`Error adding vendor ${vendorId} to user ${userId} list: `, error);
    throw error;
  }
};

// Remove a vendor from a user's list
export const removeVendorFromUserList = async (userId: string, vendorId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${userId}/vendor-list/${vendorId}`);
  } catch (error) {
    console.error(`Error removing vendor ${vendorId} from user ${userId} list: `, error);
    throw error;
  }
};
// Note: Deleting/updating reviews might have specific business logic (e.g., only by admin or original user within a time window)
// Admin functions for creating/updating vendors and categories should ideally be in Cloud Functions for security.

// === Vendor Item Management ===

const dataToVendorItem = (data: any): VendorItem => {
  return {
    id: data.id,
    vendorId: data.vendorId,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrl: data.imageUrl,
    availability: data.availability,
    location: data.location,
    createdAt: timestampToISO(data.createdAt) || new Date().toISOString(),
    updatedAt: timestampToISO(data.updatedAt) || new Date().toISOString(),
  };
};

export const searchVendorItems = async (
  params: VendorItemSearchParams,
  lastVisible?: any
): Promise<{ items: VendorItem[], total: number, lastVisible?: any }> => {
  console.log('Service: Searching vendor items from backend with params:', params);
  try {
    const queryParams = new URLSearchParams();
    if (params.vendorId) {
      queryParams.append('vendorId', params.vendorId);
    }
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.keyword) {
      queryParams.append('keyword', params.keyword);
    }
    if (params.minPrice !== undefined) {
      queryParams.append('minPrice', params.minPrice.toString());
    }
    if (params.maxPrice !== undefined) {
      queryParams.append('maxPrice', params.maxPrice.toString());
    }
    if (params.location) {
      queryParams.append('location', params.location);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (lastVisible) {
      queryParams.append('cursor', lastVisible);
    }

    const response = await axiosInstance.get(`/vendor-items/search?${queryParams.toString()}`);
    if (response.data.success && response.data.data) {
      return {
        items: (response.data.data.items || []).map(dataToVendorItem),
        total: response.data.data.total || 0,
        lastVisible: response.data.data.cursor,
      };
    }
    return { items: [], total: 0 };
  } catch (error) {
    console.error("Error searching vendor items: ", error);
    throw error;
  }
};

export const getVendorItemById = async (itemId: string): Promise<VendorItem | null> => {
  console.log(`Service: Fetching vendor item with id ${itemId} from backend...`);
  try {
    const response = await axiosInstance.get(`/vendor-items/${itemId}`);
    if (response.data.success && response.data.data) {
      return dataToVendorItem(response.data.data);
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching vendor item ${itemId}: `, error);
    throw error;
  }
};
