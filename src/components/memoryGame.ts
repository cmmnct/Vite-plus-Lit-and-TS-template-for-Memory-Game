import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import "./memoryCard.js";
import { GameLogic } from "../utils/gameLogic.js";
import { Card, CardSet } from "../models/models.js";

export class MemoryGame extends LitElement {
  @property({ type: Array }) cards: Card[] = [];
  @property({ type: Object }) state: {
    firstCard: Card | null;
    secondCard: Card | null;
    lockBoard: boolean;
  } = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
  };
  @property({ type: Number }) attempts: number = 0;
  @property({ type: Number }) gridSize: number = 0;

  static styles = css`
    .board {
      display: flex;
      flex-wrap: wrap;
      max-width: 900px;
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
    .scoreboard {
      text-align: center;
      margin-bottom: 20px;
    }
    .select-grid {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    select {
      padding: 10px;
      font-size: 16px;
    }
  `;

  constructor() {
    super();
    this.cards = [];
  }

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
        <p>Aantal pogingen: ${this.attempts}</p>
      </div>
      <div class="board board${this.gridSize}">
        ${this.cards.map(
          (card, index) => html`
            <memory-card
              .name="${card.name}"
              .imageUrl="${card.imageUrl}"
              .flipped="${card.flipped}"
              @click="${() => this.handleCardFlip(index, card)}"
            >
            </memory-card>
          `
        )}
      </div>
    `;
  }

  handleGridSizeChange(event: Event) {
    this.gridSize = parseInt((event.target as HTMLSelectElement).value);
    const totalCardSets = this.gridSize / 2;
    const selectedCardSets = GameLogic.shuffle([...this.cardSets]).slice(
      0,
      totalCardSets
    );
    this.cards = [];

    selectedCardSets.forEach((cardSet) => {
      if (cardSet.card2) {
        this.cards.push({ ...cardSet.card1, set: cardSet.set });
        this.cards.push({ ...cardSet.card2, set: cardSet.set });
      } else {
        this.cards.push({ ...cardSet.card1, set: cardSet.set });
        this.cards.push({ ...cardSet.card1, set: cardSet.set });
      }
    });

    this.cards = GameLogic.shuffle(
      this.cards.map((card) => ({ ...card, flipped: false }))
    );
    this.attempts = 0;
    this.state = {
      firstCard: null,
      secondCard: null,
      lockBoard: false,
    };
    this.requestUpdate();
  }

  handleCardFlip(index: number, card: Card) {
    if (this.state.lockBoard || card === this.state.firstCard || card.flipped) {
      return;
    }

    card.flipped = true;

    if (!this.state.firstCard) {
      this.state = { ...this.state, firstCard: card };
      return;
    }

    this.state = { ...this.state, secondCard: card, lockBoard: true };
    this.attempts += 1;

    if (
      GameLogic.checkForMatch(
        this.state.firstCard.set,
        this.state.secondCard.set
      )
    ) {
      this.updateCardsState(true);
    } else {
      setTimeout(() => this.updateCardsState(false), 1000);
    }

    if (!GameLogic.areCardsLeft(this.cards)) {
      alert("Gefeliciteerd! Je hebt alle kaarten gevonden.");
    }
  }

  updateCardsState(isMatch: boolean) {
    if (!isMatch) {
      this.state.firstCard!.flipped = false;
      this.state.secondCard!.flipped = false;
    }

    this.state = {
      firstCard: null,
      secondCard: null,
      lockBoard: false,
    };

    this.requestUpdate();
  }
}

customElements.define("memory-game", MemoryGame);
