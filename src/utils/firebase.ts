// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAJy0OZuLHPCUO0lFnM_J1TyKieNuSF6Y0",
//   authDomain: "ai-mock-interview-stimulator.firebaseapp.com",
//   projectId: "ai-mock-interview-stimulator",
//   storageBucket: "ai-mock-interview-stimulator.firebasestorage.app",
//   messagingSenderId: "201735780069",
//   appId: "1:201735780069:web:93cb6d36fec0fb79c3060c",
//   measurementId: "G-S9NLEEMZL1"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJy0OZuLHPCUO0lFnM_J1TyKieNuSF6Y0",
  authDomain: "ai-mock-interview-stimulator.firebaseapp.com",
  projectId: "ai-mock-interview-stimulator",
  storageBucket: "ai-mock-interview-stimulator.firebasestorage.app",
  messagingSenderId: "201735780069",
  appId: "1:201735780069:web:93cb6d36fec0fb79c3060c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ ADD THESE (IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);