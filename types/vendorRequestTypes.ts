export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'fulfilled';

export interface VendorRequest {
  id: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  eventId: string;
  eventName: string;
  budgetItemId?: string;
  vendorItemId?: string;
  serviceDescription?: string;
  status: RequestStatus;
  message?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateVendorRequestPayload {
  vendorId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  eventId: string;
  eventName: string;
  budgetItemId?: string;
  vendorItemId?: string;
  serviceDescription?: string;
  message?: string;
}
