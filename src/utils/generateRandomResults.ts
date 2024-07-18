import { State, Result } from "../models/models";
import { firestore } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { format } from "date-fns";
import { saveToLocalStorage } from "./localStorageHelper";

export async function generateResults(user: User, state: State) {
  const results: Result[] = [];
  const gridSizes = [16, 25, 36];
  const startDate = new Date(2024, 0, 1); // Start vanaf 1 januari 2024
  const endDate = new Date(2024, 6, 18); // Tot en met 31 december 2024

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    gridSizes.forEach((gridSize) => {
      for (let i = 0; i < 2; i++) {
        let rand = Math.floor(Math.random() * gridSize + (gridSize - 4));
        results.push({
          date: format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          attempts: rand, // Willekeurige waarde tussen 10 en 19
          gridSize,
          score: 10 * ((gridSize - 4) / rand), // Willekeurige score
        });
      }
    });
  }

  // Sorteer resultaten op datum
  results.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const userId = user?.uid;
  state.results = results;
  if (userId) {
    const stateRef = doc(firestore, `users/${userId}/gameState/state`);
    await setDoc(stateRef, state);
  } else {
    saveToLocalStorage("memoryGameState", state);
  }
}
