import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"

export const saveScore = async (scoreData) => {
  try {
    await addDoc(collection(db, "scores"), scoreData)
  } catch (error) {
    console.error("Error saving score:", error)
    throw error
  }
}