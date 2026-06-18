import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe0B5Fm-KroMKd7vcVpYtPRv17tO5TLXE",
  authDomain: "oneframe-918db.firebaseapp.com",
  projectId: "oneframe-918db",
  storageBucket: "oneframe-918db.firebasestorage.app",
  messagingSenderId: "71584177838",
  appId: "1:71584177838:web:ebcba4947adae9752b573f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();