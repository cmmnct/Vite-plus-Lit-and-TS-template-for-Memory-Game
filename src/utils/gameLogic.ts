import { Card } from "../models/models";

export class GameLogic {
  static shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  static areCardsLeft(cards: Card[]): boolean {
    return cards.some((card) => !card.exposed);
  }
}
