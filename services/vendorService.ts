import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
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
} from '../types/vendorItemTypes';
import { createVendorBookingNotification, createVendorReviewNotification } from '../services/notificationService';
import { createVendorRequest } from './vendorRequestService';
import { getEventById } from './eventService';

const VENDOR_CATEGORIES_COLLECTION = 'vendor_categories';
const VENDORS_COLLECTION = 'vendors';
const VENDOR_ITEMS_COLLECTION = 'vendorItems';
const USER_VENDOR_LISTS_COLLECTION = 'user_vendor_lists';

const timestampToISO = (timestamp?: Timestamp | Date | string): string | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  return timestamp as string;
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

export const getVendorCategories = async (parentId?: string): Promise<VendorCategory[]> => {
  console.log('Service: Fetching vendor categories from Firestore...');
  try {
    const qConstraints: QueryConstraint[] = [orderBy('displayOrder', 'asc'), orderBy('name', 'asc')];
    if (parentId) {
      qConstraints.push(where('parentCategoryId', '==', parentId));
    } else {
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

export const searchVendors = async (
  params: VendorSearchParams,
  lastVisible?: QueryDocumentSnapshot<DocumentData> // For pagination
): Promise<{ vendors: Vendor[], total: number, lastVisible?: QueryDocumentSnapshot<DocumentData> }> => {
  console.log('Service: Searching vendors from Firestore with params:', params);
  try {
    const vendorsRef = collection(firestore, VENDORS_COLLECTION);
    let qConstraints: QueryConstraint[] = [];

    if (params.categorySlug) {
      const category = await getVendorCategoryBySlug(params.categorySlug);
      if (category) {
        qConstraints.push(where('categoryIds', 'array-contains', category.id));
      } else {
        return { vendors: [], total: 0 };
      }
    }

    if (params.minRating) {
      qConstraints.push(where('averageRating', '>=', params.minRating));
    }

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

    let countQueryConstraints = qConstraints.filter(
        c => !c.type.endsWith('limit') && !c.type.endsWith('startAfter')
    );
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

export const createVendor = async (payload: CreateVendorPayload): Promise<Vendor> => {
  console.log('Service: Creating vendor in Firestore:', payload);
  try {
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
      name_lowercase: payload.name.toLowerCase(),
      categories: undefined,
      categoryIds: categoryIds,
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

    if (payload.name) {
      updateData.name_lowercase = payload.name.toLowerCase();
    }

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
      delete updateData.categories;
    }

    await updateDoc(docRef, updateData);
    const updatedDocSnap = await getDoc(docRef);
    return await docToVendor(updatedDocSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error(`Error updating vendor ${vendorId}: `, error);
    throw error;
  }
};

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

    const vendor = await getVendorById(vendorId);
    if (vendor && vendor.associatedEventIds && vendor.associatedEventIds.length > 0) {
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

export const getUserVendors = async (userId: string): Promise<Vendor[]> => {
  try {
    const vendorIds = await getUserVendorIds(userId);
    if (vendorIds.length === 0) return [];

    const MAX_IN_QUERIES = 30;
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

export const addVendorToUserList = async (userId: string, vendorId: string, eventName?: string, eventId?: string): Promise<void> => {
  try {
    const listRef = doc(firestore, USER_VENDOR_LISTS_COLLECTION, userId);
    const listSnap = await getDoc(listRef);
    let currentVendorIds: string[] = [];
    if (listSnap.exists() && listSnap.data().vendorIds) {
      currentVendorIds = listSnap.data().vendorIds;
    }
    if (!currentVendorIds.includes(vendorId)) {
      await setDoc(listRef, {
        vendorIds: [...currentVendorIds, vendorId],
        lastUpdated: serverTimestamp(),
      }, { merge: true });

      const vendor = await getVendorById(vendorId);
      if (vendor) {
        createVendorBookingNotification(userId, vendor.name, eventName || 'your event', vendorId);

        if (vendor.ownerId && eventName && eventId) {
          const userDoc = await getDoc(doc(firestore, 'users', userId));
          const customerName = userDoc.exists()
            ? userDoc.data().displayName || userDoc.data().email || 'A customer'
            : 'A customer';
          createVendorRequest({
            vendorId,
            customerId: userId,
            customerName,
            eventId,
            eventName,
            serviceDescription: `Booking inquiry for ${vendor.name}`,
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error adding vendor ${vendorId} to user ${userId} list: `, error);
    throw error;
  }
};

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
      qConstraints.push(where('category', '==', params.category));
    }
    if (params.keyword) {
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
        default:
          qConstraints.push(orderBy('createdAt', 'desc')); // Default sort
      }
    } else {
      qConstraints.push(orderBy('createdAt', 'desc'));
    }

    const pageLimit = params.limit || 10;
    qConstraints.push(firestoreLimit(pageLimit));
    if (lastVisible && params.page && params.page > 1) {
      qConstraints.push(startAfter(lastVisible));
    }

    const q = query(itemsRef, ...qConstraints);
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(docToVendorItem);

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

export const getVendorByOwnerId = async (userId: string): Promise<Vendor | null> => {
  console.log(`Service: Fetching vendor by owner ID ${userId} from Firestore...`);
  try {
    const docRef = doc(firestore, VENDORS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return await docToVendor(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error(`Error fetching vendor by owner ID ${userId}: `, error);
    return null;
  }
};

export const getVendorItemsByVendorId = async (vendorId: string): Promise<VendorItem[]> => {
  console.log(`Service: Fetching vendor items for vendor ${vendorId} from Firestore...`);
  try {
    const q = query(
      collection(firestore, VENDOR_ITEMS_COLLECTION),
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToVendorItem);
  } catch (error) {
    console.error(`Error fetching vendor items for vendor ${vendorId}: `, error);
    return [];
  }
};
