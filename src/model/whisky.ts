export interface Whisky {
  name: string;
  description: string;

  rating?: number;
  image?: string;
}

export interface StoredWhisky {
  [key: string]: Whisky;
}
