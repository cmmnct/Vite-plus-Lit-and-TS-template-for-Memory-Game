import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./memoryCard.js";
import { container } from "../../inversify.config";
import { TYPES } from "../types";
import { CardService } from "../services/cardService";
import { StateService } from "../services/stateService";
import { repeat } from "lit/directives/repeat.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./loginComponent.js";
import "./resultComponent.js";

const auth = getAuth();

@customElement("memory-game")
export class MemoryGame extends LitElement {
  @property({ type: Boolean }) loggedIn: boolean = false;
  @property({ type: Boolean }) showResults: boolean = false;
  @property({ type: Boolean }) loginState: boolean = false;

  cardService: CardService;
  stateService: StateService;

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
    this.cardService = container.get<CardService>(TYPES.CardService);
    this.stateService = container.get<StateService>(TYPES.StateService);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.loggedIn = true;
        await this.stateService.loadState();
        this.loginState = false;
      } else {
        this.loggedIn = false;
      }
      this.requestUpdate();
    });
  }

  render() {
    return html`
      ${this.loggedIn
        ? html` <div class="login-indicator">
            Ingelogd als: ${auth.currentUser?.email}
            <button @click="${this.logout}">Logout</button
            ><button @click="${this.showStats}">Show Stats</button>
          </div>`
        : html` <div class="login-indicator">
            <button @click="${this.login}">Login</button>
          </div>`}
      <div class="select-grid">
        <select @change="${this.handleGridSizeChange}">
          <option selected disabled>Kies je speelveld</option>
          <option value="16">4 x 4</option>
          <option value="24">5 x 5</option>
          <option value="36">6 x 6</option>
        </select>
      </div>
      <div class="scoreboard">
        <p>Aantal pogingen: ${this.stateService.getState().attempts}</p>
      </div>
      <div class="board board${this.stateService.getState().gridSize}">
        ${repeat(
          this.stateService.getState().cards,
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
      ${this.loginState
        ? html`<div class="login-overlay">
            <login-component
              @cancel="${() => (this.loginState = false)}"
            ></login-component>
          </div>`
        : ""}
      ${this.showResults
        ? html`
            <result-component
              .results="${this.stateService.getState().results}"
              @close-popup="${this.closePopup}"
            ></result-component>
          `
        : ""}
    `;
  }

  login() {
    this.loginState = true;
  }

  async handleGridSizeChange(event: Event) {
    await this.cardService.initializeCards(event);
    this.requestUpdate();
  }

  handleCardClick(index: number) {
    this.cardService.handleCardClick(index, () => this.requestUpdate());
  }

  async logout() {
    await this.stateService.logout()
      this.stateService.resetState(true);
      this.requestUpdate();
    };

  showStats() {
    this.showResults = true;
  }

  closePopup() {
    this.showResults = false;
  }
}
