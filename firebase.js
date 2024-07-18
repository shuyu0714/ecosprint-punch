import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeTfL3kbvaTHNbxx86MKnmjnH8BWRDQk0",
  authDomain: "ecosprint-punch.firebaseapp.com",
  databaseURL: "https://ecosprint-punch-default-rtdb.firebaseio.com",
  projectId: "ecosprint-punch",
  storageBucket: "ecosprint-punch.appspot.com",
  messagingSenderId: "932924685888",
  appId: "1:932924685888:web:6a3ddcd195b676e065e9a5",
  measurementId: "G-40FFT0D2XG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };