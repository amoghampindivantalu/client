import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// --- DEBUG LOG (Optional but helpful) ---
console.log("Reading API Key:", process.env.REACT_APP_FIRE_API_KEY); 
// --- END DEBUG LOG ---

// --- FIX: Use REACT_APP_ prefix for all variables ---
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRE_API_KEY,
  authDomain: process.env.REACT_APP_FIRE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_APP_ID,
  measurementId: process.env.REACT_APP_FIRE_MEAS // Optional
};

// Check if apiKey is actually loaded
if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing! Check your .env file and ensure the server was restarted.");
  // You might want to throw an error or handle this case appropriately
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };