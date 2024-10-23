import { Card, CardSet } from "../models/models";
import { GameLogic } from "../utils/gameLogic";

export class CardService {
  private cards: Card[] = [];
  private state = {
    firstCard: null as Card | null,
    secondCard: null as Card | null,
    lockBoard: false,
    attempts: 0,
  };

  private cardSets: CardSet[] = [
    {
      set: "duck",
    },
    {
      set: "hammer_nails",
      card1: "hammer",
      card2: "nails",
    },
    // Voeg meer cardSets toe...
  ];

  initializeCards(gridSize: number): Card[] {
    const totalCardSets = gridSize / 2;
    const selectedCardSets = GameLogic.shuffle([...this.cardSets]).slice(
      0,
      totalCardSets
    );

    this.cards = [];
    selectedCardSets.forEach((cardSet: CardSet) => {
      if (cardSet.card1 && cardSet.card2) {
        this.cards.push(this.createCard(cardSet.set, cardSet.card1));
        this.cards.push(this.createCard(cardSet.set, cardSet.card2));
      } else {
        this.cards.push(this.createCard(cardSet.set));
        this.cards.push(this.createCard(cardSet.set));
      }
    });

    return GameLogic.shuffle(this.cards);
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

  getCards(): Card[] {
    return this.cards;
  }

  getState() {
    return this.state;
  }

  resetState() {
    this.state = {
      firstCard: null,
      secondCard: null,
      lockBoard: false,
      attempts: 0,
    };
  }

  exposeCard(index: number) {
    this.cards[index].exposed = true;
  }

  hideCard(index: number) {
    this.cards[index].exposed = false;
  }

  updateCardState(
    firstCardIndex: number,
    secondCardIndex: number,
    isMatch: boolean
  ) {
    if (!isMatch) {
      this.hideCard(firstCardIndex);
      this.hideCard(secondCardIndex);
    }
  }

  incrementAttempts() {
    this.state.attempts += 1;
  }

  setFirstCard(card: Card) {
    this.state.firstCard = card;
  }

  setSecondCard(card: Card) {
    this.state.secondCard = card;
    this.state.lockBoard = true;
  }

  resetSelection() {
    this.state.firstCard = null;
    this.state.secondCard = null;
    this.state.lockBoard = false;
  }

  isInvalidClick(card: Card): boolean {
    return !!(
      this.state.lockBoard || card === this.state.firstCard || card.exposed
    );
  }

  checkMatch() {
    if (this.state.firstCard && this.state.secondCard) {
      return GameLogic.checkForMatch(
        this.state.firstCard.set,
        this.state.secondCard.set
      );
    }
    return false;
  }

  areCardsLeft() {
    return GameLogic.areCardsLeft(this.cards);
  }
}
