import { Card } from "./models/models";

export type State = {
  firstCard: Card | null;
  secondCard: Card | null;
  lockBoard: boolean;
};
