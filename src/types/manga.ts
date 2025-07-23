export interface Manga {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  genres: string[];
  publicationYear?: number;
  reviews: Review[];
  averageRating: number;
  
  // API fields
  url: string;
  images: any; 
  approved: boolean;
  titles: { type: string; title: string }[];
  title_english: string;
  title_japanese: string;
  type: string;
  mal_id: number;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: any;  
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  background: string;
  serializations: string[];
  explicit_genres: string[];
  themes: string[];
  demographics: string[];
}

export interface Review {
  id: string;
  mangaId: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
}

export interface AddMangaInput {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: string[];
  publicationYear?: number;
}
