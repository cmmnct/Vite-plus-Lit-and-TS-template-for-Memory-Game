import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDMBclQnPZrcNsevFZ0IYgTMC_0yzv-74w",
  authDomain: "memory-game-10538.firebaseapp.com",
  projectId: "memory-game-10538",
  storageBucket: "memory-game-10538.appspot.com",
  messagingSenderId: "1089085032321",
  appId: "1:1089085032321:web:f7680e66059670f1db8a80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);

export { auth, firestore };
