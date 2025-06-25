import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc, // Added setDoc
  query,
  where,
  orderBy,
  limit as firestoreLimit, // Renamed to avoid conflict with param name
  startAfter,
  Timestamp,
  serverTimestamp,
  writeBatch,
  getCountFromServer,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig'; // Assuming firebaseConfig exports initialized firestore
import {
  Vendor, VendorCategory, VendorReview,
  CreateVendorPayload, UpdateVendorPayload,
  CreateVendorReviewPayload, VendorSearchParams
} from '../types/vendorTypes';
import {
  VendorItem,
  VendorItemSearchParams,
  // CreateVendorItemPayload, // For creating items, not used in this read-focused refactor
  // UpdateVendorItemPayload, // For updating items, not used in this read-focused refactor
} from '../types/vendorItemTypes'; // Import new types
import { createVendorBookingNotification, createVendorConfirmationNotification, createVendorQuoteNotification, createVendorReviewNotification } from '../services/notificationService'; // Import new notification functions
import { getEventById } from './eventService'; // Import getEventById to fetch event details for notifications

const VENDOR_CATEGORIES_COLLECTION = 'vendor_categories';
const VENDORS_COLLECTION = 'vendors'; // Changed 'vendors' to 'profiles'
const VENDOR_ITEMS_COLLECTION = 'vendorItems'; // Added for vendor items
const USER_VENDOR_LISTS_COLLECTION = 'user_vendor_lists'; // For "Your Vendors"

// Helper to convert Firestore Timestamps to ISO strings
const timestampToISO = (timestamp?: Timestamp | Date | string): string | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  return timestamp as string; // Assume it's already an ISO string if not Timestamp or Date
};

const docToVendorCategory = (docSnap: QueryDocumentSnapshot<DocumentData>): VendorCategory => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    iconUrl: data.iconUrl,
    parentCategoryId: data.parentCategoryId,
    // Assuming createdAt and updatedAt are stored as Timestamps and are optional in the type
    createdAt: timestampToISO(data.createdAt),
    updatedAt: timestampToISO(data.updatedAt),
    isActive: data.isActive,
    displayOrder: data.displayOrder,
  } as VendorCategory;
};

const docToVendor = async (docSnap: QueryDocumentSnapshot<DocumentData>): Promise<Vendor> => {
  const data = docSnap.data();
  let categories: VendorCategory[] = [];
  if (data.categoryIds && Array.isArray(data.categoryIds)) {
    // Fetch full category objects if needed, or store basic info
    // For simplicity, let's assume categoryIds are stored and we might fetch them separately if full objects are needed everywhere
    // Or, if categories are denormalized (e.g., as an array of objects with id, name, slug)
    // For now, let's assume categoryIds are just strings and we'll fetch full objects if needed by the UI
     categories = await Promise.all(
      (data.categoryIds as string[]).map(async (catId) => {
        const catDoc = await getDoc(doc(firestore, VENDOR_CATEGORIES_COLLECTION, catId));
        return catDoc.exists() ? { id: catDoc.id, ...catDoc.data() } as VendorCategory : null;
      })
    ).then(cats => cats.filter(c => c !== null) as VendorCategory[]);
  }


  return {
    id: docSnap.id,
    name: data.name,
    name_lowercase: data.name_lowercase, // Added
    description: data.description,
    categories: categories, // This now holds VendorCategory objects
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
    createdAt: timestampToISO(data.createdAt)!, // Assert non-null if always present
    updatedAt: timestampToISO(data.updatedAt)!, // Assert non-null if always present
  };
};

const docToReview = (docSnap: QueryDocumentSnapshot<DocumentData>): VendorReview => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    vendorId: data.vendorId,
    userId: data.userId,
    rating: data.rating,
    comment: data.comment,
    reviewDate: timestampToISO(data.reviewDate)!, // Assert non-null
  };
};


// === Vendor Category Management ===
export const getVendorCategories = async (parentId?: string): Promise<VendorCategory[]> => {
  console.log('Service: Fetching vendor categories from Firestore...');
  try {
    const qConstraints: QueryConstraint[] = [orderBy('displayOrder', 'asc'), orderBy('name', 'asc')];
    if (parentId) {
      qConstraints.push(where('parentCategoryId', '==', parentId));
    } else {
      // Fetch top-level categories if no parentId is provided
      qConstraints.push(where('parentCategoryId', '==', null));
    }
    const q = query(collection(firestore, VENDOR_CATEGORIES_COLLECTION), ...qConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToVendorCategory);
  } catch (error) {
    console.error("Error fetching vendor categories: ", error);
    throw error;
  }
};

export const getVendorCategoryBySlug = async (slug: string): Promise<VendorCategory | null> => {
  console.log(`Service: Fetching vendor category by slug ${slug} from Firestore...`);
  try {
    const q = query(collection(firestore, VENDOR_CATEGORIES_COLLECTION), where('slug', '==', slug), firestoreLimit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return docToVendorCategory(querySnapshot.docs[0]);
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}: `, error);
    throw error;
  }
};

// Admin function - not for client direct use without proper auth checks via backend/functions
export const createVendorCategory = async (payload: Omit<VendorCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<VendorCategory> => {
  try {
    const docRef = await addDoc(collection(firestore, VENDOR_CATEGORIES_COLLECTION), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const docSnap = await getDoc(docRef);
    return docToVendorCategory(docSnap as QueryDocumentSnapshot<DocumentData>); // Cast needed if getDoc doesn't infer type well
  } catch (error) {
    console.error("Error creating vendor category: ", error);
    throw error;
  }
};


// === Vendor Management ===
export const searchVendors = async (
  params: VendorSearchParams,
  lastVisible?: QueryDocumentSnapshot<DocumentData> // For pagination
): Promise<{ vendors: Vendor[], total: number, lastVisible?: QueryDocumentSnapshot<DocumentData> }> => {
  console.log('Service: Searching vendors from Firestore with params:', params);
  try {
    const vendorsRef = collection(firestore, VENDORS_COLLECTION);
    let qConstraints: QueryConstraint[] = [];

    if (params.categorySlug) {
      // First, get the category ID for the given slug
      const category = await getVendorCategoryBySlug(params.categorySlug);
      if (category) {
        qConstraints.push(where('categoryIds', 'array-contains', category.id));
      } else {
        // Category not found, return no vendors
        return { vendors: [], total: 0 };
      }
    }
    // Keyword search would be more complex with Firestore and might require a dedicated search service like Algolia/Typesense
    // For a basic Firestore keyword search (not very efficient for large datasets):
    // This is a simplified example and won't scale well.
    // Firestore doesn't support native text search across multiple fields like SQL LIKE or dedicated search engines.
    // A common workaround is to have a 'keywords' array field in your documents.
    // For now, we'll filter client-side after a broader fetch if a keyword is present, or implement a more robust solution later.

    if (params.minRating) {
      qConstraints.push(where('averageRating', '>=', params.minRating));
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'rating':
          qConstraints.push(orderBy('averageRating', 'desc'));
          break;
        case 'name':
          qConstraints.push(orderBy('name', 'asc'));
          break;
        case 'featured':
          qConstraints.push(orderBy('isFeatured', 'desc')); // Assuming true means featured
          qConstraints.push(orderBy('name', 'asc')); // Secondary sort
          break;
        case 'newest':
          qConstraints.push(orderBy('createdAt', 'desc'));
          break;
        default:
          qConstraints.push(orderBy('name', 'asc')); // Default sort
      }
    } else {
      qConstraints.push(orderBy('name', 'asc')); // Default sort
    }

    // Pagination
    const pageLimit = params.limit || 10;
    qConstraints.push(firestoreLimit(pageLimit));
    if (lastVisible && params.page && params.page > 1) { // only add startAfter if not the first page
        qConstraints.push(startAfter(lastVisible));
    }
    
    const q = query(vendorsRef, ...qConstraints);
    const querySnapshot = await getDocs(q);
    const vendors = await Promise.all(querySnapshot.docs.map(docToVendor));

    // For total count, it's better to run a separate count query without pagination for accuracy,
    // or if the dataset is small, rely on the length of a broader query.
    // Firestore's getCountFromServer is efficient for this.
    // We need to build the count query without pagination constraints (limit, startAfter)
    let countQueryConstraints = qConstraints.filter(
        c => !c.type.endsWith('limit') && !c.type.endsWith('startAfter')
    );
    // If keyword search is done client-side, total count here would be for the pre-filtered set.
    // This is a simplification. A proper search solution would handle this better.
    const countSnapshot = await getCountFromServer(query(vendorsRef, ...countQueryConstraints));
    const total = countSnapshot.data().count;
    
    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { vendors, total, lastVisible: newLastVisible };
  } catch (error) {
    console.error("Error searching vendors: ", error);
    throw error;
  }
};


export const getVendorById = async (vendorId: string): Promise<Vendor | null> => {
  console.log(`Service: Fetching vendor with id ${vendorId} from Firestore...`);
  try {
    const docRef = doc(firestore, VENDORS_COLLECTION, vendorId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return await docToVendor(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error(`Error fetching vendor ${vendorId}: `, error);
    throw error;
  }
};

// For admin/internal use, not typically by end-users directly without backend mediation
export const createVendor = async (payload: CreateVendorPayload): Promise<Vendor> => {
  console.log('Service: Creating vendor in Firestore:', payload);
  try {
    // Convert category objects/slugs in payload to categoryIds if necessary
    const categoryIds = await Promise.all(
      payload.categories.map(async (catInput) => {
        if (typeof catInput === 'string') return catInput; // Already an ID
        if (catInput.id) return catInput.id;
        if (catInput.slug) {
          const cat = await getVendorCategoryBySlug(catInput.slug);
          return cat?.id;
        }
        return null;
      })
    ).then(ids => ids.filter(id => id !== null) as string[]);


    const docRef = await addDoc(collection(firestore, VENDORS_COLLECTION), {
      ...payload,
      name_lowercase: payload.name.toLowerCase(), // Added
      categories: undefined, // Remove original categories field
      categoryIds: categoryIds, // Add the processed categoryIds
      averageRating: 0,
      numberOfReviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const newDocSnap = await getDoc(docRef);
    return await docToVendor(newDocSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error("Error creating vendor: ", error);
    throw error;
  }
};

export const updateVendor = async (vendorId: string, payload: UpdateVendorPayload): Promise<Vendor | null> => {
  console.log(`Service: Updating vendor ${vendorId} in Firestore:`, payload);
  try {
    const docRef = doc(firestore, VENDORS_COLLECTION, vendorId);
    
    let updateData: any = { ...payload, updatedAt: serverTimestamp() };

    if (payload.name) { // Added
      updateData.name_lowercase = payload.name.toLowerCase(); // Added
    } // Added

    if (payload.categories) {
      const categoryIds = await Promise.all(
        payload.categories.map(async (catInput) => {
          if (typeof catInput === 'string') return catInput;
          if (catInput.id) return catInput.id;
          if (catInput.slug) {
            const cat = await getVendorCategoryBySlug(catInput.slug);
            return cat?.id;
          }
          return null;
        })
      ).then(ids => ids.filter(id => id !== null) as string[]);
      updateData.categoryIds = categoryIds;
      delete updateData.categories; // Remove original categories field from update payload
    }

    await updateDoc(docRef, updateData);
    const updatedDocSnap = await getDoc(docRef);
    return await docToVendor(updatedDocSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error(`Error updating vendor ${vendorId}: `, error);
    throw error;
  }
};

// === Vendor Review Management ===
export const getReviewsForVendor = async (
  vendorId: string,
  pageSize: number = 10,
  lastReviewDoc?: QueryDocumentSnapshot<DocumentData> // for pagination
): Promise<{ reviews: VendorReview[], total: number, lastVisible?: QueryDocumentSnapshot<DocumentData> }> => {
  console.log(`Service: Fetching reviews for vendor ${vendorId} from Firestore...`);
  try {
    const reviewsRef = collection(firestore, VENDORS_COLLECTION, vendorId, 'reviews');
    const qConstraints: QueryConstraint[] = [
      orderBy('reviewDate', 'desc'),
      firestoreLimit(pageSize)
    ];

    if (lastReviewDoc) {
      qConstraints.push(startAfter(lastReviewDoc));
    }

    const q = query(reviewsRef, ...qConstraints);
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(docToReview);

    // Get total count for this vendor's reviews
    const countQuery = query(collection(firestore, VENDORS_COLLECTION, vendorId, 'reviews'));
    const countSnapshot = await getCountFromServer(countQuery);
    const total = countSnapshot.data().count;
    
    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { reviews, total, lastVisible: newLastVisible };
  } catch (error) {
    console.error(`Error fetching reviews for vendor ${vendorId}: `, error);
    throw error;
  }
};

export const addReviewForVendor = async (vendorId: string, userId: string, payload: CreateVendorReviewPayload): Promise<VendorReview> => {
  console.log(`Service: Adding review for vendor ${vendorId} by user ${userId} in Firestore:`, payload);
  const batch = writeBatch(firestore);
  try {
    const reviewRef = doc(collection(firestore, VENDORS_COLLECTION, vendorId, 'reviews'));
    const vendorRef = doc(firestore, VENDORS_COLLECTION, vendorId);

    batch.set(reviewRef, {
      ...payload,
      vendorId,
      userId,
      reviewDate: serverTimestamp(),
    });

    // Atomically update vendor's average rating and review count
    // This is a common pattern but can be complex. For simplicity, can also be handled by a Cloud Function trigger.
    // Here's a simplified client-side update (less robust against race conditions than a transaction/function)
    const vendorSnap = await getDoc(vendorRef);
    if (vendorSnap.exists()) {
      const vendorData = vendorSnap.data();
      const currentTotalRating = (vendorData.averageRating || 0) * (vendorData.numberOfReviews || 0);
      const newNumberOfReviews = (vendorData.numberOfReviews || 0) + 1;
      const newAverageRating = (currentTotalRating + payload.rating) / newNumberOfReviews;
      batch.update(vendorRef, {
        averageRating: newAverageRating,
        numberOfReviews: newNumberOfReviews,
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
    const newReviewSnap = await getDoc(reviewRef);

    // Send notification for new vendor review
    const vendor = await getVendorById(vendorId);
    if (vendor && vendor.associatedEventIds && vendor.associatedEventIds.length > 0) {
      // Assuming the organizer of the first associated event should be notified
      const firstAssociatedEventId = vendor.associatedEventIds[0];
      const event = await getEventById(true, firstAssociatedEventId); // Assuming auth is true for this internal call
      if (event) {
        createVendorReviewNotification(event.organizerId, vendor.name, `new ${payload.rating}-star review`, vendorId);
      }
    }

    return docToReview(newReviewSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error(`Error adding review for vendor ${vendorId}: `, error);
    throw error;
  }
};


// === User's Vendor List Management ("Your Vendors") ===

// Get a user's list of vendor IDs
export const getUserVendorIds = async (userId: string): Promise<string[]> => {
  try {
    const docRef = doc(firestore, USER_VENDOR_LISTS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().vendorIds) {
      return docSnap.data().vendorIds as string[];
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
    const vendorIds = await getUserVendorIds(userId);
    if (vendorIds.length === 0) return [];

    // Firestore 'in' query supports up to 30 elements in the array.
    // If more, need to batch queries.
    const MAX_IN_QUERIES = 30; // Firestore 'in' query limit
    const vendorPromises: Promise<Vendor | null>[] = [];

    for (let i = 0; i < vendorIds.length; i += MAX_IN_QUERIES) {
        const chunkOfIds = vendorIds.slice(i, i + MAX_IN_QUERIES);
        if (chunkOfIds.length > 0) {
            const q = query(collection(firestore, VENDORS_COLLECTION), where('__name__', 'in', chunkOfIds));
            const querySnapshot = await getDocs(q);
            vendorPromises.push(...querySnapshot.docs.map(docSnap => docToVendor(docSnap as QueryDocumentSnapshot<DocumentData>)));
        }
    }
    
    const vendors = await Promise.all(vendorPromises);
    return vendors.filter(v => v !== null) as Vendor[];
  } catch (error) {
    console.error(`Error fetching full user vendors for ${userId}: `, error);
    throw error;
  }
};


// Add a vendor to a user's list
export const addVendorToUserList = async (userId: string, vendorId: string): Promise<void> => {
  try {
    const listRef = doc(firestore, USER_VENDOR_LISTS_COLLECTION, userId);
    const listSnap = await getDoc(listRef);
    let currentVendorIds: string[] = [];
    if (listSnap.exists() && listSnap.data().vendorIds) {
      currentVendorIds = listSnap.data().vendorIds;
    }
    if (!currentVendorIds.includes(vendorId)) {
      // Use setDoc with merge: true to create the document if it doesn't exist,
      // or update it if it does.
      await setDoc(listRef, {
        vendorIds: [...currentVendorIds, vendorId],
        lastUpdated: serverTimestamp(),
      }, { merge: true });

      // Send notification for vendor booking/addition to list
      const vendor = await getVendorById(vendorId);
      if (vendor) {
        // Assuming this is triggered when a user "books" or "adds" a vendor to an event
        // For simplicity, we'll notify the user who added it.
        // In a real scenario, you might need eventId context here.
        createVendorBookingNotification(userId, vendor.name, 'your event', vendorId); // 'your event' is a placeholder
      }
    }
  } catch (error) {
    console.error(`Error adding vendor ${vendorId} to user ${userId} list: `, error);
    throw error;
  }
};

// Remove a vendor from a user's list
export const removeVendorFromUserList = async (userId: string, vendorId: string): Promise<void> => {
  try {
    const listRef = doc(firestore, USER_VENDOR_LISTS_COLLECTION, userId);
    const listSnap = await getDoc(listRef);
    if (listSnap.exists() && listSnap.data().vendorIds) {
      const currentVendorIds = listSnap.data().vendorIds as string[];
      const updatedVendorIds = currentVendorIds.filter(id => id !== vendorId);
      await updateDoc(listRef, {
        vendorIds: updatedVendorIds,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error(`Error removing vendor ${vendorId} from user ${userId} list: `, error);
    throw error;
  }
};
// Note: Deleting/updating reviews might have specific business logic (e.g., only by admin or original user within a time window)
// Admin functions for creating/updating vendors and categories should ideally be in Cloud Functions for security.

// === Vendor Item Management ===

const docToVendorItem = (docSnap: QueryDocumentSnapshot<DocumentData>): VendorItem => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    vendorId: data.vendorId,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrl: data.imageUrl,
    availability: data.availability,
    location: data.location,
    createdAt: timestampToISO(data.createdAt)!,
    updatedAt: timestampToISO(data.updatedAt)!,
  };
};

export const searchVendorItems = async (
  params: VendorItemSearchParams,
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<{ items: VendorItem[], total: number, lastVisible?: QueryDocumentSnapshot<DocumentData> }> => {
  console.log('Service: Searching vendor items from Firestore with params:', params);
  try {
    const itemsRef = collection(firestore, VENDOR_ITEMS_COLLECTION);
    let qConstraints: QueryConstraint[] = [];

    if (params.vendorId) {
      qConstraints.push(where('vendorId', '==', params.vendorId));
    }
    if (params.category) {
      qConstraints.push(where('category', '==', params.category)); // Assuming item category is a direct string match
    }
    if (params.keyword) {
      // Firestore basic keyword search is limited. For robust search, consider Algolia/Typesense.
      // This example might search 'name' or 'description'. For simplicity, let's assume 'name' for now.
      // A common pattern is to have a 'keywords' array in your document.
      // This is a placeholder for a more complex keyword search logic.
      // qConstraints.push(where('name_lowercase', '>=', params.keyword.toLowerCase()));
      // qConstraints.push(where('name_lowercase', '<=', params.keyword.toLowerCase() + '\uf8ff'));
      // For now, we'll rely on client-side filtering or a very simple query if possible.
      // Or, if keywords are stored in an array:
      // qConstraints.push(where('keywords', 'array-contains', params.keyword.toLowerCase()));
    }
    if (params.minPrice !== undefined) {
      qConstraints.push(where('price', '>=', params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      qConstraints.push(where('price', '<=', params.maxPrice));
    }
    if (params.location) {
        qConstraints.push(where('location', '==', params.location));
    }


    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          qConstraints.push(orderBy('price', 'asc'));
          break;
        case 'price_desc':
          qConstraints.push(orderBy('price', 'desc'));
          break;
        case 'name':
          qConstraints.push(orderBy('name', 'asc'));
          break;
        case 'newest':
          qConstraints.push(orderBy('createdAt', 'desc'));
          break;
        // 'rating' sort would require denormalizing vendor's averageRating onto the item or complex joins not native to Firestore client SDK.
        // For now, if 'rating' is chosen, we might sort client-side after fetching vendor details, or omit this sort option.
        default:
          qConstraints.push(orderBy('createdAt', 'desc')); // Default sort
      }
    } else {
      qConstraints.push(orderBy('createdAt', 'desc')); // Default sort
    }

    const pageLimit = params.limit || 10;
    qConstraints.push(firestoreLimit(pageLimit));
    if (lastVisible && params.page && params.page > 1) {
      qConstraints.push(startAfter(lastVisible));
    }

    const q = query(itemsRef, ...qConstraints);
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(docToVendorItem);

    // Total count for pagination
    const countQueryConstraints = qConstraints.filter(
      c => !c.type.endsWith('limit') && !c.type.endsWith('startAfter')
    );
    const countSnapshot = await getCountFromServer(query(itemsRef, ...countQueryConstraints));
    const total = countSnapshot.data().count;
    
    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { items, total, lastVisible: newLastVisible };
  } catch (error) {
    console.error("Error searching vendor items: ", error);
    throw error;
  }
};

export const getVendorItemById = async (itemId: string): Promise<VendorItem | null> => {
  console.log(`Service: Fetching vendor item with id ${itemId} from Firestore...`);
  try {
    const docRef = doc(firestore, VENDOR_ITEMS_COLLECTION, itemId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docToVendorItem(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error(`Error fetching vendor item ${itemId}: `, error);
    throw error;
  }
};
