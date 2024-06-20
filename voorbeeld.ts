export type Card = {
  name: string;
  imageUrl: string;
};

export type CardSet = {
  id: number;
  set: string;
  card1: Card;
  card2?: Card; // Optional property
};
