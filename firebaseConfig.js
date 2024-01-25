import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDazLAWWXyGMzIwnpRs97gJtUFMlz12dv8",
  authDomain: "mes-bonnes-adresses-ff4e5.firebaseapp.com",
  projectId: "mes-bonnes-adresses-ff4e5",
  storageBucket: "mes-bonnes-adresses-ff4e5.appspot.com",
  messagingSenderId: "373162627903",
  appId: "1:373162627903:web:43c5f99da75a6ef52eb98a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
