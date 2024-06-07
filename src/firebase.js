import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe0B5Fm-KroMKd7vcVpYtPRv17tO5TLXE",
  authDomain: "oneframe-918db.firebaseapp.com",
  projectId: "oneframe-918db",
  storageBucket: "oneframe-918db.appspot.com",
  messagingSenderId: "71584177838",
  appId: "1:71584177838:web:ebcba4947adae9752b573f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Function to handle Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};