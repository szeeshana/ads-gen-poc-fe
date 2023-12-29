// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAdTiVU4-biu5DfS1CWVPVyqEGSAUWMxg",
  authDomain: "fir-sso-169b5.firebaseapp.com",
  projectId: "fir-sso-169b5",
  storageBucket: "fir-sso-169b5.appspot.com",
  messagingSenderId: "889049420340",
  appId: "1:889049420340:web:3171b2032fc03a6b85b061"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app