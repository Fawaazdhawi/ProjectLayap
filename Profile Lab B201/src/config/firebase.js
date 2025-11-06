import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
   apiKey: "AIzaSyDe_p9UrejMCwnz4MVufyVVko5LmrB3yY0",
  authDomain: "webb2-9b21f.firebaseapp.com",
  projectId: "webb2-9b21f",
  storageBucket: "webb2-9b21f.firebasestorage.app",
  messagingSenderId: "907610143571",
  appId: "1:907610143571:web:8eb7e1e8b4db1fff3b3fa6",
  measurementId: "G-5P6WM11ZZ9"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;