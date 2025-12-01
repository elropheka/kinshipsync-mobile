import { initializeApp, getApp, getApps, FirebaseApp } from '@firebase/app';
import { initializeAuth, Auth, getAuth, getReactNativePersistence } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDb-D_g5Nr75VCgyyrMrJ-LIxv-ve4S5B0",
  authDomain: "kinshipsync-f2896.firebaseapp.com",
  projectId: "kinshipsync-f2896",
  storageBucket: "kinshipsync-f2896.firebasestorage.app",
  messagingSenderId: "433750501084",
  appId: "1:433750501084:android:f06a69eed1511cde00b619",
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    firestore = getFirestore(app);
    storage = getStorage(app);
  } catch (e) {
    console.error("Firebase initialization error:", e);
    throw e; 
  }
} else {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, firestore, storage };
