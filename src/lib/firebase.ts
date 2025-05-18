import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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