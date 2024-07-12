import { Card, CardSet, State, Result } from "../models/models";
import { GameLogic } from "../utils/gameLogic";
import { StateService } from "./stateService";

export class CardService {
  private state: State = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    attempts: 0,
    gridSize: 0,
    cards: [],
    results: [],
  };

  constructor(private stateService: StateService) {
    this.loadState(); // Laad de state bij het initialiseren van de service
  }

  async initializeCards(event: Event): Promise<State> {
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
      const cardData = await response.json();
      const cards = this.createCardsFromSets(cardData, this.state.gridSize);
      this.state.cards = GameLogic.shuffle(cards);
      this.saveState();
      return this.state;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return this.state;
    }
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
        this.addResult(); // Voeg deze regel toe om het resultaat toe te voegen als het spel eindigt
      }
    } else {
      setTimeout(() => {
        this.state.firstCard!.exposed = false;
        this.state.secondCard!.exposed = false;
        this.resetGameState();
        updateCallback();
        this.saveState(); // Save state after resetting the game state
      }, 1000);
    }
  }

  private addResult() {
    const result: Result = {
      date: new Date().toISOString(),
      attempts: this.state.attempts,
      gridSize: this.state.gridSize!,
      score: this.calculateScore(),
    };
    this.state.results.push(result);
    this.saveState();
  }

  private calculateScore(): number {
    return Math.max(0, this.state.gridSize! * 2 - this.state.attempts);
  }

  private async saveState() {
    await this.stateService.saveState(this.state);
  }

  async loadState() {
    const savedState = await this.stateService.loadState();
    if (savedState) {
      this.state = savedState;
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
