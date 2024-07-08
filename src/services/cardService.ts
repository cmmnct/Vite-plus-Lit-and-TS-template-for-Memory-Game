import { Card, CardSet, State } from "../models/models";
import { GameLogic } from "../utils/gameLogic";
import { auth, firestore } from "../../firebaseConfig";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";

export class CardService {
  private state: State = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    attempts: 0,
    gridSize: 0,
    cards: [],
  };

  async initializeCards(event: Event): Promise<Card[]> {
    const target = event.target as HTMLSelectElement;
    this.state.gridSize = parseInt(target.value);
    this.resetGameState(true);

    const response = await fetch(
      "https://my-json-server.typicode.com/cmmnct/cards/cards"
    );
    const data = await response.json();
    const cardSets = data;

    const totalCardSets = this.state.gridSize / 2;
    const selectedCardSets = GameLogic.shuffle(cardSets).slice(
      0,
      totalCardSets
    );

    this.state.cards = [];
    selectedCardSets.forEach((cardSet: CardSet) => {
      if (cardSet.card1 && cardSet.card2) {
        this.state.cards.push(this.createCard(cardSet.set, cardSet.card1));
        this.state.cards.push(this.createCard(cardSet.set, cardSet.card2));
      } else {
        this.state.cards.push(this.createCard(cardSet.set));
        this.state.cards.push(this.createCard(cardSet.set));
      }
    });

    this.state.cards = GameLogic.shuffle(this.state.cards);
    this.saveState();
    return this.state.cards;
  }

  handleCardClick(index: number, updateCallback: () => void) {
    const clickedCard = this.state.cards[index];
    if (this.isInvalidClick(clickedCard)) return;

    clickedCard.exposed = true;
    updateCallback();

    if (!this.state.firstCard) {
      this.state.firstCard = clickedCard;
      return;
    }

    this.state.secondCard = clickedCard;
    this.state.attempts++;
    this.state.lockBoard = true;
    updateCallback();

    if (this.state.firstCard.set === this.state.secondCard.set) {
      if (this.cardsLeft(this.state.cards)) {
        this.resetGameState();
        updateCallback();
        this.saveState(); // Save state after match is found
      } else {
        alert("Gefeliciteerd! Je hebt alle kaarten gevonden.");
        this.saveState(); // Save state when all cards are matched
      }
    } else {
      setTimeout(() => {
        this.state.firstCard!.exposed = false;
        this.state.secondCard!.exposed = false;
        this.resetGameState();
        updateCallback();
        this.saveState(); // Save state after cards are flipped back
      }, 1000);
    }
  }

  private async saveState() {
    console.log("saveState");
    const userId = auth.currentUser?.uid;
    console.log("auth.currentUser:", auth.currentUser); // Toegevoegd voor debuggen
    console.log("user ID = " + userId);

    try {
      if (userId) {
        const stateRef = doc(firestore, `users/${userId}/gameState/state`);
        console.log("firestore is set, stateRef:", stateRef);
        await setDoc(stateRef, this.state);
        console.log("State saved to Firestore"); // Toegevoegd voor debuggen
      } else {
        console.log("Saving state to local storage");
        localStorage.setItem("memoryGameState", JSON.stringify(this.state));
        console.log("State saved to local storage"); // Toegevoegd voor debuggen
      }
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }

  async loadState() {
    const userId = auth.currentUser?.uid;
    if (userId) {
      try {
        const stateRef = doc(firestore, `users/${userId}/gameState/state`);
        const stateDoc = await getDoc(stateRef);
        if (stateDoc.exists()) {
          this.state = stateDoc.data() as State;
          console.log("State loaded from Firestore:", this.state);
        } else {
          console.log(
            "No state document found in Firestore, using default state."
          );
        }
      } catch (error) {
        console.error("Error loading state from Firestore:", error);
      }
    } else {
      const savedState = localStorage.getItem("memoryGameState");
      if (savedState) {
        this.state = JSON.parse(savedState);
        console.log("State loaded from local storage:", this.state);
      } else {
        console.log("No state found in local storage, using default state.");
      }
    }
  }

  getState() {
    return this.state;
  }

  private cardsLeft(cards: Card[]): boolean {
    return cards.some((card) => !card.exposed);
  }

  private createCard(
    set: string,
    name?: string,
    exposed: boolean = false
  ): Card {
    return {
      name: name || set,
      set,
      exposed,
    };
  }

  resetGameState(init: boolean = false) {
    this.state.firstCard = null;
    this.state.secondCard = null;
    this.state.lockBoard = false;
    if (init) {
      this.state.attempts = 0;
      this.state.cards = [];
    }
    return this.state;
  }

  private isInvalidClick(clickedCard: Card): boolean {
    return !!(
      this.state.lockBoard ||
      clickedCard === this.state.firstCard ||
      clickedCard.exposed
    );
  }
}
