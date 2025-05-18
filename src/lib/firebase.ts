import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCLSSqRZ0mBLkFrKsjt5kK6fenmSyv2Go",
  authDomain: "taluo-313cc.firebaseapp.com",
  projectId: "taluo-313cc",
  storageBucket: "taluo-313cc.firebasestorage.app",
  messagingSenderId: "52217005453",
  appId: "1:52217005453:web:683bdbccf5d5c7e2d5a9c4",
  measurementId: "G-GKSW58GDXK"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Function to clear all reading records
export const clearAllReadings = async () => {
  try {
    // Clear fortunes collection
    const fortunesSnapshot = await getDocs(collection(db, 'fortunes'));
    const fortuneDeletes = fortunesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    
    // Clear readings collection
    const readingsSnapshot = await getDocs(collection(db, 'readings'));
    const readingDeletes = readingsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    
    // Execute all deletions
    await Promise.all([...fortuneDeletes, ...readingDeletes]);
    
    return true;
  } catch (error) {
    console.error('Error clearing readings:', error);
    return false;
  }
};