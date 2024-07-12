import { auth, firestore } from "../../firebaseConfig";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { State } from "../models/models";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

export class StateService {
  private user: User | null = null;

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  }

  async saveState(state: State) {
    const userId = this.user?.uid;
    if (userId) {
      const stateRef = doc(firestore, `users/${userId}/gameState/state`);
      await setDoc(stateRef, state);
    } else {
        saveToLocalStorage("memoryGameState", state);
    }
  }

  async loadState(): Promise<State | null> {
    const userId = this.user?.uid;
    if (userId) {
      const stateRef = doc(firestore, `users/${userId}/gameState/state`);
      const stateDoc = await getDoc(stateRef);
      if (stateDoc.exists()) {
        return stateDoc.data() as State;
      }
    } else {
      const savedState = loadFromLocalStorage("memoryGameState");
      if (savedState) {
        return JSON.parse(savedState) as State;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  getUserEmail(): string | null {
    return this.user?.email || null;
  }

  async logout() {
    await auth.signOut();
  }
}
