import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// Your Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyAE_KWScRF5hIkFDylpGmE6aUYaKDIi11I",
  authDomain: "lifesync-c3712.firebaseapp.com",
  projectId: "lifesync-c3712",
  storageBucket: "lifesync-c3712.appspot.com",
  messagingSenderId: "847804275056",
  appId: "1:847804275056:web:1c923bded3f3286cf197b5",
  measurementId: "G-6L4VGQY860"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth (if needed)
const auth = getAuth(app);
export const logInWithEmailAndPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email, password, userData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore with the user's UID
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      familyId: userData.familyId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      linkedGoogleCalendar: userData.linkedGoogleCalendar
    });
    
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Export db and auth for use in your components
export { db, auth };