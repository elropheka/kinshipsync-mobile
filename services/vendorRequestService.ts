import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import {
  VendorRequest,
  CreateVendorRequestPayload,
  RequestStatus,
} from '../types/vendorRequestTypes';
import { createCustomerRequestNotification, createRequestStatusChangeNotification } from './notificationService';

const VENDOR_REQUESTS_COLLECTION = 'vendor_requests';

const docToVendorRequest = (docSnap: any): VendorRequest => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    vendorId: data.vendorId,
    customerId: data.customerId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    eventId: data.eventId,
    eventName: data.eventName,
    budgetItemId: data.budgetItemId,
    vendorItemId: data.vendorItemId,
    serviceDescription: data.serviceDescription,
    status: data.status || 'pending',
    message: data.message,
    createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
    updatedAt: (data.updatedAt as Timestamp)?.toMillis() || Date.now(),
  };
};

export const createVendorRequest = async (payload: CreateVendorRequestPayload): Promise<VendorRequest | null> => {
  try {
    const docRef = await addDoc(collection(firestore, VENDOR_REQUESTS_COLLECTION), {
      ...payload,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) return null;
    return docToVendorRequest(createdDoc);
  } catch (error) {
    console.error('Error creating vendor request:', error);
    return null;
  }
};

export const getVendorRequests = async (
  vendorId: string,
  statusFilter?: RequestStatus
): Promise<VendorRequest[]> => {
  try {
    const qConstraints: any[] = [where('vendorId', '==', vendorId), orderBy('createdAt', 'desc')];
    if (statusFilter) {
      qConstraints.unshift(where('status', '==', statusFilter));
    }
    const q = query(collection(firestore, VENDOR_REQUESTS_COLLECTION), ...qConstraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToVendorRequest);
  } catch (error) {
    console.error('Error fetching vendor requests:', error);
    return [];
  }
};

export const getCustomerRequests = async (customerId: string): Promise<VendorRequest[]> => {
  try {
    const q = query(
      collection(firestore, VENDOR_REQUESTS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToVendorRequest);
  } catch (error) {
    console.error('Error fetching customer requests:', error);
    return [];
  }
};

export const listenToVendorRequests = (
  vendorId: string,
  callback: (requests: VendorRequest[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const q = query(
    collection(firestore, VENDOR_REQUESTS_COLLECTION),
    where('vendorId', '==', vendorId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const requests = snapshot.docs.map(docToVendorRequest);
      callback(requests);
    },
    (error) => {
      console.error('Error listening to vendor requests:', error);
      onError?.(error);
    }
  );
};

export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus
): Promise<boolean> => {
  try {
    const docRef = doc(firestore, VENDOR_REQUESTS_COLLECTION, requestId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      const request = docToVendorRequest(updatedDoc);
      createRequestStatusChangeNotification(request.customerId, request.customerName, status, requestId);
    }
    return true;
  } catch (error) {
    console.error('Error updating request status:', error);
    return false;
  }
};

export const getVendorRequestById = async (requestId: string): Promise<VendorRequest | null> => {
  try {
    const docRef = doc(firestore, VENDOR_REQUESTS_COLLECTION, requestId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docToVendorRequest(docSnap);
  } catch (error) {
    console.error('Error fetching vendor request:', error);
    return null;
  }
};
