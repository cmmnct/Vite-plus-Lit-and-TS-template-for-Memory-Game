export type Card = {
  name: string;
  set: string;
  flipped?: boolean;
};

export type CardSet = {
  set: string;
  card1?: string;
  card2?: string;
};

export type State = {
  firstCard: Card | null;
  secondCard: Card | null;
  lockBoard: boolean;
};
