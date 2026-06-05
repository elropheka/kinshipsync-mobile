import { FirestoreError } from 'firebase/firestore';
import { getErrorMessage } from '@/utils/errorUtils';

export class FirestoreListenerUtils {
  public static toListenerError(error: FirestoreError): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(getErrorMessage(error));
  }

  public static handleSnapshotError(
    error: FirestoreError,
    onError?: (error: Error) => void,
    context?: string,
  ): void {
    if (context) {
      console.error(`${context}:`, error);
    } else {
      console.error('Firestore listener error:', error);
    }
    onError?.(this.toListenerError(error));
  }
}

export const handleSnapshotError = FirestoreListenerUtils.handleSnapshotError.bind(FirestoreListenerUtils);
export const toFirestoreListenerError = FirestoreListenerUtils.toListenerError.bind(FirestoreListenerUtils);
