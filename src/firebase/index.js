import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {
  addDoc,
  collection,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIkn9P8FTN27pwwlMn54b7H6ycEbLS2oU",
  authDomain: "template-7dff1.firebaseapp.com",
  projectId: "template-7dff1",
  storageBucket: "template-7dff1.firebasestorage.app",
  messagingSenderId: "523603081078",
  appId: "1:523603081078:web:0c38b6687a04e00f376c57",
  measurementId: "G-1R5G6RFLTQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
// Signup function
export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User logged in:", user);
    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const addDocument = async ({ name, email, userId }) => {
  console.log('name',name)
  console.log('email',email)
  console.log('userId',userId)
  try {
    // Reference to the collection
    const colRef = collection(db, "userDetails");

    // Add a new document and get the generated ID
    const docRef = await addDoc(colRef, {
      name,
      email,
      userId,
    });

    // Update the document to include the document ID inside the data
    await setDoc(doc(db, "userDetails", docRef.id), {
      name,
      email,
      userId,
      docId: docRef.id, // Adding the document ID as a field
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
