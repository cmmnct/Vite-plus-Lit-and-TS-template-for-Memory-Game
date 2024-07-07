import { Card, CardSet, State } from "../models/models";
import { GameLogic } from "../utils/gameLogic";

export class CardService {
  private state: State;

  constructor() {
    this.state = this.loadStateFromLocalStorage() || {
      firstCard: null,
      secondCard: null,
      lockBoard: false,
      attempts: 0,
      gridSize: 0,
      cards: [],
    };
  }

  private cardSets: CardSet[] = [
    { set: "duck", card1: "", card2: "" },
    { set: "kitten", card1: "", card2: "" },
    // Voeg hier de overige cardSets toe zoals eerder gedefinieerd
  ];

  async initializeCards(event: Event): Promise<Card[]> {
    const target = event.target as HTMLSelectElement;
    this.state.gridSize = parseInt(target.value);
    this.resetGameState(true);

    try {
      const response = await fetch(
        "https://my-json-server.typicode.com/cmmnct/cards/cards"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const cards = data; // Aangepast om data rechtstreeks toe te wijzen

      this.state.cards = this.createCardsFromSets(cards, this.state.gridSize);
      this.saveStateToLocalStorage();
      return GameLogic.shuffle(this.state.cards);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [];
    }
  }

  handleCardClick(index: number, updateCallback: () => void) {
    const clickedCard = this.state.cards[index];
    if (this.isInvalidClick(clickedCard)) return;

    clickedCard.exposed = true;
    updateCallback();

    if (!this.state.firstCard) {
      this.state.firstCard = clickedCard;
      this.saveStateToLocalStorage();
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
      } else {
        alert("Gefeliciteerd! Je hebt alle kaarten gevonden.");
      }
    } else {
      setTimeout(() => {
        this.state.firstCard!.exposed = false;
        this.state.secondCard!.exposed = false;
        this.resetGameState();
        updateCallback();
      }, 1000);
    }

    this.saveStateToLocalStorage();
  }

  getState(): State {
    return this.state;
  }

  private cardsLeft(cards: Card[]): boolean {
    return cards.some((card) => !card.exposed);
  }

  private createCardsFromSets(cardSets: CardSet[], gridSize: number): Card[] {
    const totalCardSets = gridSize / 2;
    const selectedCardSets = GameLogic.shuffle([...cardSets]).slice(
      0,
      totalCardSets
    );

    const cards: Card[] = [];
    selectedCardSets.forEach((cardSet: CardSet) => {
      if (cardSet.card1 && cardSet.card2) {
        cards.push(this.createCard(cardSet.set, cardSet.card1));
        cards.push(this.createCard(cardSet.set, cardSet.card2));
      } else {
        cards.push(this.createCard(cardSet.set));
        cards.push(this.createCard(cardSet.set));
      }
    });

    return cards;
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

  private resetGameState(init: boolean = false) {
    this.state.firstCard = null;
    this.state.secondCard = null;
    this.state.lockBoard = false;
    if (init) {
      this.state.attempts = 0;
      this.state.cards = [];
    }
    this.saveStateToLocalStorage();
  }

  private isInvalidClick(clickedCard: Card): boolean {
    return !!(
      this.state.lockBoard ||
      clickedCard === this.state.firstCard ||
      clickedCard.exposed
    );
  }

  private saveStateToLocalStorage() {
    localStorage.setItem("memoryGameState", JSON.stringify(this.state));
  }

  private loadStateFromLocalStorage(): State | null {
    const state = localStorage.getItem("memoryGameState");
    return state ? JSON.parse(state) : null;
  }
}
