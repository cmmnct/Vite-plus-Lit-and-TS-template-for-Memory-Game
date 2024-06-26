import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./memoryCard.js";
import { Card, State } from "../models/models";
import { CardService } from "../services/cardService";
import { repeat } from "lit/directives/repeat.js";

@customElement("memory-game")
export class MemoryGame extends LitElement {
  @property({ type: Array }) cards: Card[] = [];

  cardService: CardService;
  state: State;

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
    this.cardService = new CardService();
    this.state = this.cardService.getState();
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
        <p>Aantal pogingen: ${this.state.attempts}</p>
      </div>
      <div class="board board${this.state.gridSize}">
        ${repeat(
          this.cards,
          (card) => card.name,
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
    this.cards = this.cardService.initializeCards(event);
    this.requestUpdate();
  }

  handleCardClick(index: number) {
    this.cardService.handleCardClick(index, () => this.requestUpdate());
  }
}
