import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./memoryCard.js";
import { Card, State } from "../models/models";
import { CardService } from "../services/cardService";
import { repeat } from "lit/directives/repeat.js";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./loginComponent.js";
import "./resultComponent.js"; // Voeg de result component toe

@customElement("memory-game")
export class MemoryGame extends LitElement {
  @property({ type: Array }) cards: Card[] = [];
  @property({ type: Boolean }) loggedIn: boolean = false;
  @property({ type: Boolean }) showResults: boolean = false; // Voeg showResults property toe

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
    .login-indicator {
      text-align: right;
      padding: 10px;
      font-size: 14px;
    }
  `;

  constructor() {
    super();
    this.cardService = new CardService();
    this.state = this.cardService.getState();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loggedIn = true;
        this.loadState();
      } else {
        this.loggedIn = false;
      }
      this.requestUpdate();
    });
  }

  async loadState() {
    await this.cardService.loadState();
    this.state = this.cardService.getState();
    this.cards = this.state.cards;
    this.requestUpdate();
  }

  render() {
    return html`
      ${this.loggedIn
        ? html`
            <div class="login-indicator">
              Ingelogd als: ${auth.currentUser?.email}
              <button @click="${this.logout}">Logout</button>
            </div>
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
            <button class="results-button" @click="${this.showStats}">
              Show Stats
            </button>
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
          `
        : html`<login-component></login-component>`}
      ${this.showResults
        ? html`<result-component
            .results="${this.state.results}"
            @close-popup="${this.closePopup}"
          ></result-component>`
        : ""}
    `;
  }

  async handleGridSizeChange(event: Event) {
    this.cards = await this.cardService.initializeCards(event);
    this.requestUpdate();
  }

  handleCardClick(index: number) {
    this.cardService.handleCardClick(index, () => this.requestUpdate());
  }

  logout() {
    auth.signOut().then(() => {
      this.loggedIn = false;
      this.cards = [];
      this.state = this.cardService.resetGameState(true);
      this.requestUpdate();
    });
  }
  showStats() {
    this.showResults = true;
  }

  closePopup() {
    console.log("closed")
    this.showResults = false;
  }
}
