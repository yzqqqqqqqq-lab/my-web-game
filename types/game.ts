export interface Game {
  id: string;
  title: string;
  cover: string;
  category: string[];
  rating: number;
  playCount: number;
  description: string;
  demoUrl: string;
  detailedDescription?: string;
}

