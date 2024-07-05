import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

interface Card {
  name: string;
  set: string;
  exposed: boolean;
}

interface CardSet {
  set: string;
  card1?: string;
  card2?: string;
}

@customElement("memory-game")
export class MemoryGame extends LitElement {
  @property({ type: Array }) cards: Card[] = [];

  private gridSize: number = 0;
  private state = {
    firstCard: null as Card | null,
    secondCard: null as Card | null,
    lockBoard: false,
    attempts: 0,
  };

  private cardSets: CardSet[] = [
    { set: "duck", card1: "", card2: "" },
    { set: "kitten", card1: "", card2: "" },
    { set: "piglet", card1: "", card2: "" },
    { set: "puppy", card1: "", card2: "" },
    { set: "calf", card1: "", card2: "" },
    { set: "veal", card1: "", card2: "" },
    { set: "lamb", card1: "", card2: "" },
    { set: "rooster", card1: "", card2: "" },
    { set: "horse", card1: "", card2: "" },
    { set: "mouse", card1: "", card2: "" },
    { set: "dog", card1: "", card2: "" },
    { set: "cat", card1: "", card2: "" },
    { set: "goose", card1: "", card2: "" },
    { set: "goat", card1: "", card2: "" },
    { set: "sheep", card1: "", card2: "" },
    { set: "pig", card1: "", card2: "" },
    { set: "cow", card1: "", card2: "" },
    { set: "chick", card1: "", card2: "" },
    { set: "hen", card1: "", card2: "" },
    { set: "donkey", card1: "", card2: "" },
    { set: "peacock", card1: "", card2: "" },
    { set: "pigeon", card1: "", card2: "" },
    { set: "fox", card1: "", card2: "" },
    { set: "hedgehog", card1: "", card2: "" },
  ];

  static styles = css`
    * {
      box-sizing: border-box;
    }
    .select-grid {
      text-align: center;
      margin-bottom: 20px;
    }
    .scoreboard {
      text-align: center;
      margin-bottom: 20px;
    }
    .board {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: auto;
    }
    .board16 memory-card {
      width: calc(25% - 20px);
      aspect-ratio: 1/1;
      margin: 10px;
    }
    .board24 memory-card {
      width: calc(20% - 20px);
      aspect-ratio: 1/1;
      margin: 10px;
    }
    .board36 memory-card {
      width: calc(16.66% - 20px);
      aspect-ratio: 1/1;
      margin: 10px;
    }
  `;

  render() {
    return html`
      <div class="select-grid">
        <select @change="${this.handleGridSizeChange}">
          <option selected disabled>Kies je speelveld</option>
          <option value="16">4 x 4</option>
          <option value="24">5 x 5</option>
          <option value="36">6 x 6</option>
        </select>
      </div>
      <div class="scoreboard">
        <p>Aantal pogingen: ${this.state.attempts}</p>
      </div>
      <div class="board board${this.gridSize}">
        ${this.cards.map(
          (card, index) => html`
            <memory-card
              .name="${card.name}"
              .set="${card.set}"
              .exposed="${card.exposed}"
              @click="${() => this.handleCardClick(index)}"
            >
            </memory-card>
          `
        )}
      </div>
    `;
  }

  handleGridSizeChange(event: Event) {
    this.gridSize = parseInt((event.target as HTMLSelectElement).value);
    this.initializeCards();
    this.requestUpdate();
  }

  handleCardClick(index: number) {
    const clickedCard = this.cards[index];
    if (this.isInvalidClick(clickedCard)) return;

    clickedCard.exposed = true;
    this.requestUpdate();

    if (!this.state.firstCard) {
      this.state.firstCard = clickedCard;
      return;
    }

    this.state.secondCard = clickedCard;
    this.state.attempts++;
    this.state.lockBoard = true;
    this.requestUpdate();

    if (this.checkMatch()) {
      if (this.areCardsLeft()) {
        this.resetGameState();
        this.requestUpdate();
      } else {
        alert("Gefeliciteerd! Je hebt alle kaarten gevonden.");
      }
    } else {
      setTimeout(() => {
        this.state.firstCard!.exposed = false;
        this.state.secondCard!.exposed = false;
        this.resetGameState();
        this.requestUpdate();
      }, 1000);
    }
  }

  initializeCards() {
    this.resetGameState(true);
    const totalCardSets = this.gridSize / 2;
    const selectedCardSets = this.shuffle([...this.cardSets]).slice(
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

    this.cards = this.shuffle(this.cards);
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
    }
  }

  private isInvalidClick(clickedCard: Card): boolean {
    return !!(
      this.state.lockBoard ||
      clickedCard === this.state.firstCard ||
      clickedCard.exposed
    );
  }

  private checkMatch(): boolean {
    if (this.state.firstCard && this.state.secondCard) {
      return this.state.firstCard.set === this.state.secondCard.set;
    }
    return false;
  }

  private areCardsLeft(): boolean {
    return this.cards.some((card) => !card.exposed);
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
