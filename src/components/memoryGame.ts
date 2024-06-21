import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { memoryGameStyles } from "./memoryGameStyles";
import { memoryGameTemplate } from "./memoryGameTemplate";
import "./memoryCard.js";
import { Card } from "../models/models";
import { CardService } from "../services/cardService";

export class MemoryGame extends LitElement {
  @property({ type: Array }) cards: Card[] = [];
  @property({ type: Number }) gridSize: number = 0;

  cardService: CardService;

  static styles = memoryGameStyles;

  constructor() {
    super();
    this.cards = [];
    this.cardService = new CardService();
  }

  render() {
    return memoryGameTemplate(this);
  }

  handleGridSizeChange(event: Event) {
    this.gridSize = parseInt((event.target as HTMLSelectElement).value);
    this.cards = this.cardService.initializeCards(this.gridSize);
    this.cardService.resetState();
    this.requestUpdate();
  }

  handleCardFlip(index: number, card: Card) {
    if (this.checkInvalidClick(card)) return;

    this.cardService.exposeCard(index);
    this.requestUpdate();

    if (this.cardService.checkMatch()) {
      this.handleMatch();
    } else if (this.cardService.getState().secondCard) {
      this.handleNoMatch();
    }
  }

  checkInvalidClick(card: Card): boolean {
    return this.cardService.isInvalidClick(card);
  }

  handleMatch() {
    this.cardService.incrementAttempts();
    this.requestUpdate();

    if (this.cardService.areCardsLeft()) {
      this.cardService.resetSelection();
      this.requestUpdate();
    } else {
      alert("Gefeliciteerd! Je hebt alle kaarten gevonden.");
    }
  }

  handleNoMatch() {
    this.cardService.incrementAttempts();
    this.requestUpdate();

    setTimeout(() => {
      const state = this.cardService.getState();
      const firstCardIndex = this.cards.indexOf(state.firstCard!);
      const secondCardIndex = this.cards.indexOf(state.secondCard!);

      this.cardService.updateCardState(firstCardIndex, secondCardIndex, false);
      this.cardService.resetSelection();
      this.requestUpdate();
    }, 1000);
  }
}

customElements.define("memory-game", MemoryGame);
