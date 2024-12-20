// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz4zCemGt4XZKZCuCI_FwQwXSFxeaqvk0",
  authDomain: "studyguide-ea1f4.firebaseapp.com",
  projectId: "studyguide-ea1f4",
  storageBucket: "studyguide-ea1f4.appspot.com",
  messagingSenderId: "1090855415134",
  appId: "1:1090855415134:web:e68c6916b6c5b7e5d9f3cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };