// import { db } from "./firebase";
// import { collection, addDoc } from "firebase/firestore";

// export const saveInterview = async (
//   userId: string,
//   data: {
//     role: string;
//     questions: string[];
//     answers: string[];
//   }
// ) => {
//   try {
//     const ref = collection(db, "users", userId, "interviews");

//     const docRef = await addDoc(ref, {
//       ...data,
//       createdAt: new Date(),
//     });

//     console.log("✅ Interview saved with ID:", docRef.id);
//   } catch (error) {
//     console.error("❌ Error saving interview:", error);
//   }
// };

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const saveInterview = async (
  userId: string,
  data: {
    role: string;
    questions: string[];
    answers: string[];
  }
) => {
  try {
    const ref = collection(db, "users", userId, "interviews");

    const docRef = await addDoc(ref, {
      ...data,
      createdAt: new Date(),
    });

    console.log("✅ Interview saved with ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error saving interview:", error);
  }
};