import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";

// Initialize Firestore
const db = getFirestore(app);

export { db };