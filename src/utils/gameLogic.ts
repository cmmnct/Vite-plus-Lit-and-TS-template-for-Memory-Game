import { Card } from "../models/models";

export class GameLogic {
  static shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static checkForMatch(set1: string, set2: string): boolean {
    return set1 === set2;
  }

  static areCardsLeft(cards: Card[]): boolean {
    return cards.some((card) => !card.exposed);
  }
}
