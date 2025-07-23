import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

import Navbar from '../components/Navbar';
import MangaCard from '../components/MangaCard';
import { useManga } from '../context/MangaContext';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const { searchManga, searchOnline, importOnlineManga } = useManga();
  const [tab, setTab] = useState<'local' | 'online'>(initialQuery ? 'online' : 'local');
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [onlineQuery, setOnlineQuery] = useState(initialQuery);
  const [localResults, setLocalResults] = useState(searchManga(initialQuery));
  const [onlineResults, setOnlineResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalResults(searchManga(localQuery));
  }, [localQuery]);

  useEffect(() => {
    if (initialQuery) {
      handleOnlineSearch();
    }
  }, []);

  const handleOnlineSearch = async () => {
    if (!onlineQuery.trim()) return;
    setIsLoading(true);
    try {
      const results = await searchOnline(onlineQuery);
      setOnlineResults(results);
      setTab('online');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openMangasPage = (mangaId: string | number): void => {
    navigate(`/manga/${mangaId}`);
  };

  const handleImport = (manga: any) => {
    importOnlineManga(manga);
  };

  return (
    <div className="min-h-screen ">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-manga-red pb-2">Search Manga</h1>

        {/* Tabs */}
        <div className="flex mb-8 gap-2">
          <button
            onClick={() => setTab('local')}
            className={`flex-1 py-2 text-center ${
              tab === 'local' ? 'border-b-2 border-manga-red font-semibold' : 'text-gray-600'
            }`}
          >
            Your Collection
          </button>
          <button
            onClick={() => setTab('online')}
            className={`flex-1 py-2 text-center ${
              tab === 'online' ? 'border-b-2 border-manga-red font-semibold' : 'text-gray-600'
            }`}
          >
            Online Search
          </button>
        </div>

        {/* Local Tab Content */}
        {tab === 'local' && (
          <div>
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your manga collection..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-manga-red"
              />
            </div>
            {localResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {localResults.map((m) => (
                  <MangaCard key={m.id} manga={m} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No results found in your collection.</p>
                <p className="text-gray-400">Try different keywords or switch to online search.</p>
              </div>
            )}
          </div>
        )}

        {/* Online Tab Content */}
        {tab === 'online' && (
          <div>
            <div className="flex mb-6">
              <div className="relative flex-1 mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search online for manga..."
                  value={onlineQuery}
                  onChange={(e) => setOnlineQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleOnlineSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-manga-red"
                />
              </div>
              <button
                onClick={handleOnlineSearch}
                disabled={isLoading}
                className="px-5 py-2 bg-manga-red text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Searching online databases...</p>
              </div>
            ) : onlineResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineResults.map((manga) => (
                  <div
                    onClick={() => openMangasPage(manga.mal_id)}
                    key={manga.mal_id}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row cursor-pointer"
                  >
                    <div className="md:w-1/3 flex-shrink-0">
                      <img
                        src={manga.images?.jpg?.image_url || '/placeholder.svg'}
                        alt={manga.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-lg mb-1">{manga.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {manga.authors?.map((a: any) => a.name).join(', ') || 'Unknown author'}
                      </p>
                      <p className="text-sm mb-4 flex-grow line-clamp-3">
                        {manga.synopsis || 'No description available.'}
                      </p>
                      <button
                        onClick={() => handleImport(manga)}
                        className="mt-auto px-4 py-2 bg-manga-red text-white rounded hover:bg-red-700 transition"
                      >
                        Add to Collection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : onlineQuery ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found online.</p>
                <p className="text-gray-400 mt-2">Try different keywords or check your connection.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Search for manga titles online.</p>
                <p className="text-gray-400 mt-2">Find new manga to add to your collection.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
