// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxR2luHNLL90z5aT_WDshUpSyZDto2fBA",
  authDomain: "ticohub-ccdd4.firebaseapp.com",
  projectId: "ticohub-ccdd4",
  storageBucket: "ticohub-ccdd4.appspot.com",
  messagingSenderId: "107461356026",
  appId: "1:107461356026:web:2a1c1f78a4641fb827dc43",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, GoogleAuthProvider };
