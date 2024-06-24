import { LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import { memoryGameStyles } from "./memoryGameStyles";
import { memoryGameTemplate } from "./memoryGameTemplate";
import "./memoryCard.js";
import { Card } from "../models/models";
import { CardService } from "../services/cardService";

@customElement("memory-game")
export class MemoryGame extends LitElement {
  @property({ type: Array }) cards: Card[] = [];

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
    this.cards = this.cardService.initializeCards(event);
    this.requestUpdate();
  }

  handleCardClick(index: number) {
    this.cardService.handleCardClick(index, () => this.requestUpdate());
  }

  updateScore() {
    // Implementeer score update logica
  }

  promptNewGame() {
    // Implementeer nieuwe spel prompt logica
  }
}
