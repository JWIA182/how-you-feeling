import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDn-I3BoupBEdBAB5CKcDxHGRNskSEupOw",
  authDomain: "howyoufeelingapp.firebaseapp.com",
  projectId: "howyoufeelingapp",
  storageBucket: "howyoufeelingapp.firebasestorage.app",
  messagingSenderId: "418526119839",
  appId: "1:418526119839:web:1fc712ba05874ac5b81faa",
  measurementId: "G-Z5GXYE7KPS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
