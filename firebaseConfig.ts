import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


const firebaseConfig ={
  apiKey: "AIzaSyBjlb2NQwGxczpcyY6x37p6b1xFPjPmcVs",
  authDomain: "todoappproject-39199.firebaseapp.com",
  projectId: "todoappproject-39199",
  storageBucket: "todoappproject-39199.appspot.com",
  messagingSenderId: "897376842376",
  appId: "1:897376842376:web:def2a47103d9df9394a53d"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);