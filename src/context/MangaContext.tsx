import React, { createContext, useState, useContext, useRef } from 'react';
import type { Manga, Review, AddMangaInput } from '../types/manga';

interface MangaContextType {
  mangas: Manga[];
  topMangaList: Manga[];
  recentMangaRecommendations: Manga[];
  setTopMangaList: (list: Manga[]) => void;
  setRecentMangaRecommendations: (list: Manga[]) => void;
  addManga: (input: AddMangaInput) => void;
  getManga: (id: string) => Manga | undefined;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  searchManga: (query: string) => Manga[];
  searchOnline: (query: string) => Promise<any[]>;
  importOnlineManga: (mangaData: any) => void;
  reviews: Review[];
  fetchReviews: (mangaId: string) => Promise<void>;
  fetchRecentRecommendations: () => Promise<Manga[]>;
  nsfwEnabled: boolean;
  toggleNsfw: () => void;
} 

const MangaContext = createContext<MangaContextType | undefined>(undefined);

const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return parseFloat((total / reviews.length).toFixed(1));
};

const sampleMangas: Manga[] = [];

export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangas, setMangas] = useState<Manga[]>(sampleMangas);
  const [topMangaList, setTopMangaList] = useState<Manga[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recentMangaRecommendations, setRecentMangaRecommendations] = useState<Manga[]>([]);
  const [nsfwEnabled,setNsfwEnabled] = useState(true)

  const cacheRef = useRef<Record<string, Review[]>>({});

  const addManga = (input: AddMangaInput) => {
    const newManga: Manga = {
      ...input,
      id: crypto.randomUUID(),
      reviews: [],
      averageRating: 0,
      url: '',
      images: {},
      approved: true,
      titles: [],
      title_english: input.title,
      title_japanese: input.title,
      type: 'Manga',
      mal_id: 0,
      chapters: 0,
      volumes: 0,
      status: 'Unknown',
      publishing: false,
      published: {},
      score: 0,
      scored_by: 0,
      rank: 0,
      popularity: 0,
      members: 0,
      favorites: 0,
      background: '',
      serializations: [],
      explicit_genres: [],
      themes: [],
      demographics: []
    };
    setMangas(prev => [...prev, newManga]);
  };

  const getManga = (id: string): Manga | undefined =>
    mangas.find(m => m.id === id) || topMangaList.find(m => m.id === id);

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    setReviews(prev => [...prev, newReview]);

    const updateList = (list: Manga[]) =>
      list.map(m => {
        if (m.id !== reviewData.mangaId) return m;
        const updatedReviews = [...m.reviews, newReview];
        return {
          ...m,
          reviews: updatedReviews,
          averageRating: calculateAverageRating(updatedReviews)
        };
      });

    if (mangas.some(m => m.id === reviewData.mangaId)) {
      setMangas(updateList);
    } else {
      setTopMangaList(updateList);
    }
  };

  const searchManga = (query: string): Manga[] => {
    if (!query) return mangas;
    const q = query.toLowerCase();
    return mangas.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.author.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q))
    );
  };

  const searchOnline = async (query: string): Promise<any[]> => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&sfw=${nsfwEnabled}`);
      const { data } = await res.json();
      return data || [];
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    }
  };

  const importOnlineManga = (mangaData: any) => {
    if (mangas.some(m => m.title === mangaData.title)) return;

    const imported: Manga = {
      id: crypto.randomUUID(),
      title: mangaData.title ?? 'Unknown',
      description: mangaData.synopsis ?? 'No description available.',
      author: mangaData.authors?.map((a: any) => a.name).join(', ') ?? 'Unknown',
      coverImage: mangaData.images?.jpg?.image_url ?? '/placeholder.svg',
      genres: mangaData.genres?.map((g: any) => g.name) ?? [],
      publicationYear: mangaData.published?.prop?.from?.year ?? null,
      reviews: [],
      averageRating: 0,
      url: mangaData.url ?? '',
      images: mangaData.images ?? {},
      approved: true,
      titles: mangaData.titles ?? [],
      title_english: mangaData.title_english ?? mangaData.title ?? '',
      title_japanese: mangaData.title_japanese ?? mangaData.title ?? '',
      type: mangaData.type ?? 'Manga',
      mal_id: mangaData.mal_id ?? 0,
      chapters: mangaData.chapters ?? 0,
      volumes: mangaData.volumes ?? 0,
      status: mangaData.status ?? 'Unknown',
      publishing: mangaData.publishing ?? false,
      published: mangaData.published ?? {},
      score: mangaData.score ?? 0,
      scored_by: mangaData.scored_by ?? 0,
      rank: mangaData.rank ?? 0,
      popularity: mangaData.popularity ?? 0,
      members: mangaData.members ?? 0,
      favorites: mangaData.favorites ?? 0,
      background: mangaData.background ?? '',
      serializations: mangaData.serializations?.map((s: any) => s.name) ?? [],
      explicit_genres: mangaData.explicit_genres?.map((g: any) => g.name) ?? [],
      themes: mangaData.themes?.map((t: any) => t.name) ?? [],
      demographics: mangaData.demographics?.map((d: any) => d.name) ?? []
    };

    setMangas(prev => [...prev, imported]);
  };

  const fetchReviews = async (mangaId: string) => {
    if (cacheRef.current[mangaId]) {
      setReviews(cacheRef.current[mangaId]);
      return;
    }

    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/reviews/manga/${mangaId}`);
        if (res.status === 429 || res.status === 404) {
          await new Promise(resolve => setTimeout(resolve, (attempts + 1) * 1000));
          attempts++;
          continue;
        }

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];

      const mapped = data.map((item: any) => ({
      id: String(item.mal_id),
      mangaId,
      userId: item.user?.username ?? 'unknown',
      username: item.user?.username ?? 'Anonymous',
      rating: item.score ?? 0,
      content: item.review ?? item.content ?? '',
      createdAt: item.date ? new Date(item.date) : new Date(),  
    }));

        cacheRef.current[mangaId] = mapped;
        setReviews(mapped);
        break;
      } catch (err) {
        console.error('Review fetch failed:', err);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const fetchRecentRecommendations = async (): Promise<Manga[]> => {
    try {
      const res = await fetch('https://api.jikan.moe/v4/recommendations/manga');
      const { data } = await res.json();

      const mangaList: Manga[] = data
        .flatMap((rec: any) => Array.isArray(rec.entry) ? rec.entry : [rec.entry])
        .slice(0, 10)
        .map((entry: any) => ({
          id: String(entry.mal_id),
          title: entry.title ?? 'Unknown',
          description: entry.synopsis ?? '',
          author: '',
          coverImage: entry.images?.jpg?.image_url ?? '/placeholder.svg',
          genres: [],
          reviews: [],
          averageRating: entry.score ?? 0,
          publicationYear: null,
          url: entry.url ?? '',
          images: entry.images ?? {},
          approved: true,
          titles: [],
          title_english: entry.title_english ?? entry.title ?? '',
          title_japanese: entry.title_japanese ?? '',
          type: entry.type ?? 'Manga',
          mal_id: entry.mal_id ?? 0,
          chapters: entry.chapters ?? 0,
          volumes: entry.volumes ?? 0,
          status: entry.status ?? 'Unknown',
          publishing: false,
          published: {},
          score: entry.score ?? 0,
          scored_by: 0,
          rank: 0,
          popularity: 0,
          members: 0,
          favorites: 0,
          background: '',
          serializations: [],
          explicit_genres: [],
          themes: [],
          demographics: [],
        }));

      setRecentMangaRecommendations(mangaList);
      return mangaList;
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      return [];
    }
  };
  const toggleNsfw = ()=>{
    setNsfwEnabled(prev => {
    const next = !prev;
    return next;});
  }

  return (
    <MangaContext.Provider
      value={{
        mangas,
        topMangaList,
        recentMangaRecommendations,
        setTopMangaList,
        setRecentMangaRecommendations,
        addManga,
        getManga,
        addReview,
        searchManga,
        searchOnline,
        importOnlineManga,
        reviews,
        fetchReviews,
        fetchRecentRecommendations,
        nsfwEnabled,
        toggleNsfw
        
      }}
    >
      {children}
    </MangaContext.Provider>
  );
};

export const useManga = (): MangaContextType => {
  const context = useContext(MangaContext);
  if (!context) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
};
