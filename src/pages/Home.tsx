import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import MangaCard from '../components/MangaCard';
import { useManga } from '../context/MangaContext';
import type { Manga } from '../types/manga';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home: React.FC = () => {
  const { mangas, topMangaList, setTopMangaList } = useManga();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTopLoading, setIsTopLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchTopManga = async () => {
      try {
        setIsTopLoading(true);
        const response = await fetch('https://api.jikan.moe/v4/top/manga');
        const json = await response.json();

        const items = Array.isArray(json?.data) ? json.data : [];
        if (items.length === 0) {
          console.warn('No top manga data returned from API');
          return;
        }

        const topList: Manga[] = items.slice(0, 10).map((item: any) => ({
          id: String(item.mal_id),
          title: item.title,
          description: item.synopsis || '',
          author: item.authors?.map((a: any) => a.name).join(', ') || 'Unknown',
          coverImage: item.images?.jpg?.image_url || '/placeholder.svg',
          genres: item.genres?.map((g: any) => g.name) || [],
          publicationYear: item.year,
          reviews: [],
          averageRating: item.score || 0,
        }));

        setTopMangaList(topList);
      } catch (err) {
        console.error('Failed to fetch top manga:', err);
      } finally {
        setIsTopLoading(false);
      }
    };

    if (topMangaList.length === 0) {
      fetchTopManga();
    }
  }, [setTopMangaList, topMangaList.length]);

  useEffect(() => {
    if (isTopLoading) {
      const timeoutId = setTimeout(() => {
        if (isTopLoading) {
          console.warn('Still loading after 4 seconds — reloading page');
          window.location.reload();
        }
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [isTopLoading]);

  const recentMangas = [...mangas]
    .sort((a, b) => {
      const lastA = a.reviews.length
        ? new Date(a.reviews[a.reviews.length - 1].createdAt).getTime()
        : 0;
      const lastB = b.reviews.length
        ? new Date(b.reviews[b.reviews.length - 1].createdAt).getTime()
        : 0;
      return lastB - lastA;
    })
    .slice(0, 5);

  const topRatedMangas = [...mangas]
    .filter(m => m.reviews.length > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  return (
   
    <main className="min-h-screen pt-6 px-2 sm:px-4">
       <AlertBanner/>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 text-center md:text-left w-full md:w-auto">
            Welcome to ReviewRōmaji
          </h2>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 w-full max-w-lg"
            role="search"
          >
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your manga..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-manga-red"
                aria-label="Search manga"
              />
            </div>
            <button
              type="submit"
              className="bg-manga-red text-white font-medium rounded-md px-6 py-2 hover:bg-red-700 transition w-full sm:w-auto"
            >
              Search
            </button>
          </form>

          <Link to="/addManga" className="w-full sm:w-auto">
            <button className="flex items-center justify-center bg-white border border-manga-red text-manga-red px-6 py-2 rounded-md hover:bg-manga-red hover:text-white transition w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Add Manga
            </button>
          </Link>
        </div>

        {/* Top Rated Manga */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">My Top Rated Manga</h2>
          {topRatedMangas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topRatedMangas.map(m => (
                <MangaCard key={m.id} manga={m} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">No rated manga yet. Add some reviews!</p>
          )}
        </section>

        {/* Top Manga from API */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">World Top Manga</h2>
          {isTopLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner fill="red" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topMangaList.map(m => (
                <MangaCard key={m.id} manga={m} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        {recentMangas.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recentMangas.map(m => (
                <MangaCard key={m.id} manga={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Home;
