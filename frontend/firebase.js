import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMFCXzOJ0lTX4sghR8pJ-FHOGa3l1vVus",
  authDomain: "numerano.firebaseapp.com",
  projectId: "numerano",
  storageBucket: "numerano.firebasestorage.app",
  messagingSenderId: "678773734082",
  appId: "1:678773734082:web:ef0b571b261a83e781195b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
