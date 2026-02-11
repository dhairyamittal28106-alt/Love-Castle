
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase safely
let app: import("firebase/app").FirebaseApp | undefined;
let auth: import("firebase/auth").Auth | undefined;
let db: import("firebase/firestore").Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;

try {
    // Only initialize if config is present (basic check)
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
    } else {
        console.warn("Firebase config missing. Chat features will not work.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { auth, db, googleProvider };
