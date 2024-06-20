export type Card = {
  name: string;
  imageUrl: string;
  flipped?: boolean;
};

export type CardSet = {
  id: number;
  set: string;
  card1: Card;
  card2?: Card; // Optional property
};
