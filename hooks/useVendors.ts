import { useState, useCallback, useEffect } from 'react';
import * as vendorService from '../services/vendorService';
import {
  Vendor, VendorCategory, VendorReview,
  CreateVendorReviewPayload, VendorSearchParams
} from '../types/vendorTypes';
import { VendorItem, VendorItemSearchParams } from '../types/vendorItemTypes';
import { useAppAuth } from './useAppAuth';

import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export interface DisplayVendorItem extends VendorItem {
  vendorProfile?: Vendor | null;
}
export const useVendorCategories = (parentId?: string) => {
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async (pId?: string) => {
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
      if (loadMore && result.vendors.length > 0) {
        setSearchParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
      } else if (!loadMore) {
        setSearchParams(prev => ({ ...prev, page: 1 }));
      }

    } catch (e) {
      setError(e as Error);
      console.error("Failed to search vendors:", e);
    } finally {
      setIsLoading(false);
    }
  }, [lastVisibleDoc]);

  useEffect(() => {
    performSearch(searchParams, false);
  }, [searchParams, performSearch]);


  const updateSearchCriteria = useCallback((newCriteria: Partial<VendorSearchParams>) => {
    setLastVisibleDoc(undefined);
    setSearchParams(prev => ({ ...(prev || { page: 1, limit: 10 }), ...newCriteria, page: 1 }));
  }, []);

  const loadMore = () => {
    if (vendors.length < totalVendors && !isLoading) {
      performSearch(searchParams, true);
    }
  };

  return { vendors, totalVendors, isLoading, error, searchParams, performSearch: (params: VendorSearchParams) => performSearch(params, false), updateSearchCriteria, loadMore };
};

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
      setLastReviewVisibleDoc(undefined);
      fetchReviews(vendorId, 10, false); 
      fetchVendor(vendorId); 
      return newReview;
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to add review for vendor ${vendorId}:`, e);
      throw e;
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
    fetchVendor,
    fetchReviews,
    addReview,
    loadMoreReviews,
  };
};

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
      setUserVendors([]);
    }
  }, [userId, fetchUserVendors]);

  return { userVendors, isLoading, error, refetchUserVendors: fetchUserVendors };
};

export const useVendorItemsSearch = (initialCriteria?: VendorItemSearchParams) => {
  const [displayItems, setDisplayItems] = useState<DisplayVendorItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [searchCriteria, setSearchCriteria] = useState<VendorItemSearchParams>(initialCriteria || { limit: 100 });
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
      setTotalItems(criteriaToFetch.vendorCategorySlug ? itemsWithVendors.length : result.total);
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
  }, [lastVisibleDoc]);

  useEffect(() => {
    setLastVisibleDoc(undefined);
    fetchData(searchCriteria, 1, false); 
  }, [
    searchCriteria, 
    fetchData
  ]);

  const updateSearchCriteria = useCallback((newCriteria: Partial<VendorItemSearchParams>) => {
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
  }, [searchCriteria.keyword, searchCriteria.category, searchCriteria.vendorId, searchCriteria.vendorCategorySlug]);


  const loadMore = useCallback(() => {
    if (displayItems.length < totalItems && !isLoading) {
      const nextPage = currentPage + 1;
      fetchData(searchCriteria, nextPage, true);
      setCurrentPage(nextPage);
    }
  }, [displayItems.length, totalItems, isLoading, currentPage, searchCriteria, fetchData]);

  const performItemSearch = useCallback((params: VendorItemSearchParams) => {
    updateSearchCriteria(params);
  }, [updateSearchCriteria]);

  return { 
    displayItems, 
    totalItems, 
    isLoading, 
    error, 
    performItemSearch: performItemSearch,
    updateItemSearchCriteria: updateSearchCriteria,
    loadMoreItems: loadMore,
  };
};

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
        const vendorProfile = await vendorService.getVendorById(itemData.vendorId);
        setDisplayItem({ ...itemData, vendorProfile });
      } else {
        setDisplayItem(null);
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
