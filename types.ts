export interface OHCard {
  id: string;
  text: string;
  imageUrl: string;
  source: 'classic' | 'ai';
}

export interface CardState {
  currentCard: OHCard | null;
  isFlipped: boolean;
  isLoading: boolean;
  history: OHCard[];
}