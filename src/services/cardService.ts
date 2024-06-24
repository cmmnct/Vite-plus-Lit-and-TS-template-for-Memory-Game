import { Card, CardSet } from "../models/models";
import { GameLogic } from "../utils/gameLogic";

export class CardService {
  private cards: Card[] = [];
  private gridSize: number = 0;
  private state = {
    firstCard: null as Card | null,
    secondCard: null as Card | null,
    lockBoard: false,
    attempts: 0,
  };

  private cardSets: CardSet[] = [
    {
      set: "duck",
      card1: "",
      card2: "",
    },
    {
      set: "kitten",
      card1: "",
      card2: "",
    },
    {
      set: "piglet",
      card1: "",
      card2: "",
    },
    {
      set: "puppy",
      card1: "",
      card2: "",
    },
    {
      set: "calf",
      card1: "",
      card2: "",
    },
    {
      set: "veal",
      card1: "",
      card2: "",
    },
    {
      set: "lamb",
      card1: "",
      card2: "",
    },
    {
      set: "rooster",
      card1: "",
      card2: "",
    },
    {
      set: "horse",
      card1: "",
      card2: "",
    },
    {
      set: "mouse",
      card1: "",
      card2: "",
    },
    {
      set: "dog",
      card1: "",
      card2: "",
    },
    {
      set: "cat",
      card1: "",
      card2: "",
    },
    {
      set: "goose",
      card1: "",
      card2: "",
    },
    {
      set: "goat",
      card1: "",
      card2: "",
    },
    {
      set: "sheep",
      card1: "",
      card2: "",
    },
    {
      set: "pig",
      card1: "",
      card2: "",
    },
    {
      set: "cow",
      card1: "",
      card2: "",
    },
    {
      set: "chick",
      card1: "",
      card2: "",
    },
    {
      set: "hen",
      card1: "",
      card2: "",
    },
    {
      set: "donkey",
      card1: "",
      card2: "",
    },
    {
      set: "peacock",
      card1: "",
      card2: "",
    },
    {
      set: "pigeon",
      card1: "",
      card2: "",
    },
    {
      set: "fox",
      card1: "",
      card2: "",
    },
    {
      set: "hedgehog",
      card1: "",
      card2: "",
    },
  ];

  initializeCards(event: Event): Card[] {
    this.gridSize = parseInt((event.target as HTMLSelectElement).value);
    this.resetState();
    const totalCardSets = this.gridSize / 2;
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

  getState() {
    return this.state;
  }

  getGridSize(): number {
    return this.gridSize;
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
      this.state.lockBoard ||
      card === this.state.firstCard ||
      card.exposed
    );
  }

  checkMatch(): boolean {
    if (this.state.firstCard && this.state.secondCard) {
      return GameLogic.checkForMatch(
        this.state.firstCard.set,
        this.state.secondCard.set
      );
    }
    return false;
  }

  areCardsLeft(): boolean {
    return GameLogic.areCardsLeft(this.cards);
  }

  handleCardClick(index: number, updateCallback: () => void) {
    const card = this.cards[index];
    if (this.isInvalidClick(card)) return;

    this.exposeCard(index);
    updateCallback();

    if (!this.state.firstCard) {
      this.setFirstCard(card);
      return;
    }

    this.setSecondCard(card);
    this.incrementAttempts();
    updateCallback();

    if (this.checkMatch()) {
      if (this.areCardsLeft()) {
        this.resetSelection();
        updateCallback();
      } else {
        alert("Gefeliciteerd! Je hebt alle kaarten gevonden.");
      }
    } else {
      setTimeout(() => {
        const firstCardIndex = this.cards.indexOf(this.state.firstCard!);
        const secondCardIndex = this.cards.indexOf(this.state.secondCard!);

        this.updateCardState(firstCardIndex, secondCardIndex, false);
        this.resetSelection();
        updateCallback();
      }, 1000);
    }
  }
}
