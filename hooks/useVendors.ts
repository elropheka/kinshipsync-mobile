import { useState, useCallback, useEffect } from 'react';
import * as vendorService from '../services/vendorService';
import {
  Vendor, VendorCategory, VendorReview,
  CreateVendorReviewPayload, VendorSearchParams
} from '../types/vendorTypes';
// UserProfile is not needed here if vendorProfile is Vendor
import { VendorItem, VendorItemSearchParams } from '../types/vendorItemTypes'; // Import VendorItem types
import { useAppAuth } from './useAppAuth'; // For userId if adding reviews
import { useAuth } from '../context/AuthContext'; // Added

import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'; // Added for pagination

// Combined type for display purposes
export interface DisplayVendorItem extends VendorItem {
  vendorProfile?: Vendor | null; // Reverted to Vendor | null
}
// Hook for fetching and managing vendor categories
export const useVendorCategories = (parentId?: string) => { // Added parentId parameter
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async (pId?: string) => { // Renamed parentId to pId to avoid conflict
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendorCategories(pId);
      setCategories(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch vendor categories:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(parentId);
  }, [fetchCategories, parentId]);

  return { categories, isLoading, error, fetchCategories };
};

// Hook for searching vendors and managing a list of vendors
export const useVendorSearch = (initialSearchParams?: VendorSearchParams) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalVendors, setTotalVendors] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams, setSearchParams] = useState<VendorSearchParams>(initialSearchParams || { page: 1, limit: 10 });
  const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);

  const performSearch = useCallback(async (params: VendorSearchParams, loadMore = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentLastVisible = loadMore ? lastVisibleDoc : undefined;
      const result = await vendorService.searchVendors(params, currentLastVisible);
      
      setVendors(prev => loadMore && currentLastVisible ? [...prev, ...result.vendors] : result.vendors);
      setTotalVendors(result.total);
      setLastVisibleDoc(result.lastVisible);
      // Update page number in searchParams if loading more
      if (loadMore && result.vendors.length > 0) {
        setSearchParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
      } else if (!loadMore) {
        // Reset page to 1 if it's a new search
        setSearchParams(prev => ({ ...prev, page: 1 }));
      }

    } catch (e) {
      setError(e as Error);
      console.error("Failed to search vendors:", e);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed lastVisibleDoc, setters are stable

  useEffect(() => {
    // Perform initial search, not loading more
    performSearch(searchParams, false);
  }, [searchParams.categorySlug, searchParams.keyword, searchParams.minRating, searchParams.sortBy, searchParams.limit]); // Dependencies that trigger a new search


  const updateSearchCriteria = useCallback((newCriteria: Partial<VendorSearchParams>) => {
    setLastVisibleDoc(undefined); // Reset pagination cursor
    setSearchParams(prev => ({ ...(prev || { page: 1, limit: 10 }), ...newCriteria, page: 1 })); // Reset to page 1
  }, []); // Stable reference

  const loadMore = () => {
    if (vendors.length < totalVendors && !isLoading) {
       // Pass current searchParams, and indicate it's a loadMore operation
      performSearch(searchParams, true);
    }
  };

  return { vendors, totalVendors, isLoading, error, searchParams, performSearch: (params: VendorSearchParams) => performSearch(params, false), updateSearchCriteria, loadMore };
};


// Hook for managing a single vendor's details and reviews
export const useVendorDetail = (vendorId?: string) => {
  const { user: authUser } = useAppAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<VendorReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [lastReviewVisibleDoc, setLastReviewVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  
  const [isLoadingVendor, setIsLoadingVendor] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVendor = useCallback(async (id: string) => {
    setIsLoadingVendor(true);
    setError(null);
    try {
      const data = await vendorService.getVendorById(id);
      setVendor(data);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to fetch vendor ${id}:`, e);
    } finally {
      setIsLoadingVendor(false);
    }
  }, []);

  const fetchReviews = useCallback(async (id: string, pageSize: number = 10, loadMore = false) => {
    setIsLoadingReviews(true);
    setError(null);
    try {
      const currentLastVisible = loadMore ? lastReviewVisibleDoc : undefined;
      const result = await vendorService.getReviewsForVendor(id, pageSize, currentLastVisible);
      
      setReviews(prev => loadMore && currentLastVisible ? [...prev, ...result.reviews] : result.reviews);
      setTotalReviews(result.total);
      setLastReviewVisibleDoc(result.lastVisible);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to fetch reviews for vendor ${id}:`, e);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [lastReviewVisibleDoc]);

  useEffect(() => {
    if (vendorId) {
      fetchVendor(vendorId);
      setLastReviewVisibleDoc(undefined); 
      fetchReviews(vendorId, 10, false); 
    } else {
      setVendor(null);
      setReviews([]);
      setTotalReviews(0);
      setLastReviewVisibleDoc(undefined);
    }
  }, [vendorId, fetchVendor, fetchReviews]);

  const addReview = useCallback(async (payload: CreateVendorReviewPayload) => {
    if (!vendorId) { setError(new Error("Vendor ID not provided.")); return null; }
    if (!authUser?.uid) { setError(new Error("User not authenticated.")); return null; }

    setIsSubmittingReview(true);
    setError(null);
    try {
      const newReview = await vendorService.addReviewForVendor(vendorId, authUser.uid, payload);
      // Refetch reviews to see the new one and update counts/ratings from server
      setLastReviewVisibleDoc(undefined); // Reset pagination
      fetchReviews(vendorId, 10, false); 
      // Optionally, refetch vendor details if review affects averageRating/numberOfReviews and it's not updated optimistically
      fetchVendor(vendorId); 
      return newReview;
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to add review for vendor ${vendorId}:`, e);
      throw e; // Re-throw to allow UI to handle if needed
    } finally {
      setIsSubmittingReview(false);
    }
  }, [vendorId, authUser, fetchReviews, fetchVendor]);

  const loadMoreReviews = (pageSize: number = 10) => {
    if (vendorId && reviews.length < totalReviews && !isLoadingReviews) {
        fetchReviews(vendorId, pageSize, true);
    }
  };

  return {
    vendor,
    reviews,
    totalReviews,
    isLoading: isLoadingVendor || isLoadingReviews,
    isLoadingVendor,
    isLoadingReviews,
    isSubmittingReview,
    error,
    fetchVendor, // To manually refetch vendor
    fetchReviews, // To manually refetch reviews (e.g., for pagination)
    addReview,
    loadMoreReviews,
  };
};

// Hook for fetching vendors a user has chosen to patronize
export const useUserVendors = (userId?: string) => {
  const [userVendors, setUserVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserVendors = useCallback(async (id: string) => {
    if (!id) {
      setUserVendors([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getUserVendors(id);
      setUserVendors(data);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to fetch vendors for user ${id}:`, e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserVendors(userId);
    } else {
      // Clear vendors if userId is not provided (e.g., user logged out)
      setUserVendors([]);
    }
  }, [userId, fetchUserVendors]);

  return { userVendors, isLoading, error, refetchUserVendors: fetchUserVendors };
};

// Hook for searching vendor items and managing a list of items with their vendor profiles
export const useVendorItemsSearch = (initialCriteria?: VendorItemSearchParams) => {
  const [displayItems, setDisplayItems] = useState<DisplayVendorItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // searchCriteria stores the actual filters like vendorId, category, keyword
  const [searchCriteria, setSearchCriteria] = useState<VendorItemSearchParams>(initialCriteria || { limit: 100 }); // High limit for pickers
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);

  const fetchData = useCallback(async (criteriaToFetch: VendorItemSearchParams, page: number, isLoadMore: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const LVD = isLoadMore ? lastVisibleDoc : undefined;
      const paramsForService = { ...criteriaToFetch, page, limit: criteriaToFetch.limit || 100 };
      
      const result = await vendorService.searchVendorItems(paramsForService, LVD);
      
      let itemsWithVendors: DisplayVendorItem[] = await Promise.all(
        result.items.map(async (item) => {
          const vendorProfile = await vendorService.getVendorById(item.vendorId);
          return { ...item, vendorProfile };
        })
      );

      // Client-side filter by vendorCategorySlug if provided (as in original logic)
      if (criteriaToFetch.vendorCategorySlug) {
        const categoryToFilter = await vendorService.getVendorCategoryBySlug(criteriaToFetch.vendorCategorySlug);
        if (categoryToFilter && categoryToFilter.id) {
          itemsWithVendors = itemsWithVendors.filter(displayItem => 
            displayItem.vendorProfile?.categories?.some(cat => cat.id === categoryToFilter.id)
          );
        } else {
          itemsWithVendors = [];
        }
      }
      
      setDisplayItems(prev => isLoadMore ? [...prev, ...itemsWithVendors] : itemsWithVendors);
      setTotalItems(criteriaToFetch.vendorCategorySlug ? itemsWithVendors.length : result.total); // Adjust total if client-filtered
      setLastVisibleDoc(result.lastVisible);
      if (!isLoadMore) {
        setCurrentPage(1);
      }

    } catch (e) {
      setError(e as Error);
      console.error("Failed to search vendor items:", e);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps: uses lastVisibleDoc from state, setters are stable.

  // Effect to fetch data when searchCriteria (excluding page) changes
  useEffect(() => {
    // Always attempt to fetch when primary search criteria change.
    // The fetchData function (and the service it calls) will handle undefined filters correctly
    // by typically not applying them, thus fetching "all" if no specific filters are set.
    setLastVisibleDoc(undefined); // Reset pagination for any new criteria-based search
    fetchData(searchCriteria, 1, false); 
  }, [
    searchCriteria.vendorId, 
    searchCriteria.category, 
    searchCriteria.keyword, 
    searchCriteria.minPrice, 
    searchCriteria.maxPrice, 
    searchCriteria.location, 
    searchCriteria.sortBy, 
    searchCriteria.limit,
    searchCriteria.vendorCategorySlug,
    fetchData // fetchData reference is stable
  ]);
  // Note: fetchData is in dependency array. Its own useCallback deps must be stable.

  const updateSearchCriteria = useCallback((newCriteria: Partial<VendorItemSearchParams>) => {
    // Clear items immediately for responsiveness if primary filters change
    const primaryFiltersChanged = 
        (newCriteria.keyword !== undefined && newCriteria.keyword !== searchCriteria.keyword) ||
        (newCriteria.category !== undefined && newCriteria.category !== searchCriteria.category) ||
        (newCriteria.vendorId !== undefined && newCriteria.vendorId !== searchCriteria.vendorId) ||
        (newCriteria.vendorCategorySlug !== undefined && newCriteria.vendorCategorySlug !== searchCriteria.vendorCategorySlug);

    if (primaryFiltersChanged) {
        setDisplayItems([]);
        setTotalItems(0);
    }
    setSearchCriteria(prev => ({ ...(prev || {}), ...(newCriteria || {}), limit: prev?.limit || 100, page: 1 }));
    // The useEffect above will trigger fetchData
  }, []); // Stable: setSearchCriteria is stable. Other state setters also stable.


  const loadMore = useCallback(() => {
    if (displayItems.length < totalItems && !isLoading) {
      const nextPage = currentPage + 1;
      fetchData(searchCriteria, nextPage, true); // fetchData uses current searchCriteria state
      setCurrentPage(nextPage);
    }
  }, [displayItems.length, totalItems, isLoading, currentPage, searchCriteria, fetchData]);

  // This is the function BudgetForm will call. It just updates the criteria.
  // Renamed from performSearch in previous thought process to align with what BudgetForm expects.
  const performItemSearch = useCallback((params: VendorItemSearchParams) => {
    updateSearchCriteria(params);
  }, [updateSearchCriteria]); // updateSearchCriteria is now stable

  return { 
    displayItems, 
    totalItems, 
    isLoading, 
    error, 
    performItemSearch: performItemSearch, // Exposed for BudgetForm, calls updateSearchCriteria
    updateItemSearchCriteria: updateSearchCriteria, // Expose updateSearchCriteria under the key "updateItemSearchCriteria"
    loadMoreItems: loadMore,
  };
};

// Hook for managing a single vendor item's details (including vendor profile)
export const useVendorItemDetail = (itemId?: string) => {
  const [displayItem, setDisplayItem] = useState<DisplayVendorItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItemDetail = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const itemData = await vendorService.getVendorItemById(id);
      if (itemData) {
        const vendorProfile = await vendorService.getVendorById(itemData.vendorId); // Reverted to vendorService
        setDisplayItem({ ...itemData, vendorProfile });
      } else {
        setDisplayItem(null); // Item not found
      }
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to fetch vendor item detail for ${id}:`, e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (itemId) {
      fetchItemDetail(itemId);
    } else {
      setDisplayItem(null);
    }
  }, [itemId, fetchItemDetail]);

  return { displayItem, isLoading, error, refetchItemDetail: fetchItemDetail };
};
