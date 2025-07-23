
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Manga {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  synopsis: string;
}

const GenreMangaList: React.FC = () => {
  const { id } = useParams();  
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMangaByGenre = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://api.jikan.moe/v4/manga?genres=${id}&order_by=score&sort=desc&limit=20&page=${page}`);
        const data = await res.json();

        if (data.data.length === 0) {
          setHasMore(false);
          return;
        }
 
        setMangaList(prev => (page === 1 ? data.data : [...prev, ...data.data]));
      } catch (err) {
        console.error('Failed to fetch manga by genre:', err);
        setError('Failed to load manga.');
      } finally {
        setLoading(false);
      }
    };

    fetchMangaByGenre();
  }, [id, page]);

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (error) return <p className="text-center text-red-500 px-4">{error}</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Manga in This Genre
      </h2>

      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {mangaList.map((manga) => (
          <Link key={manga.mal_id} to={`/manga/${manga.mal_id}`}>
            <li className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-2 sm:p-3 cursor-pointer group">
              <img
                src={manga.images.jpg.image_url}
                alt={manga.title}
                className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded group-hover:scale-105 transition-transform duration-200"
              />
              <div className="mt-2 sm:mt-3">
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                  {manga.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                  {manga.synopsis}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      {loading && (
        <div className="text-center my-6 sm:my-8">
          <p className="text-sm sm:text-base text-gray-600">Loading...</p>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={handleNextPage}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white text-sm sm:text-base rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Load More
          </button>
        </div>
      )}

      {!hasMore && (
        <p className="text-center mt-6 sm:mt-8 text-gray-500 text-sm sm:text-base">
          No more manga to load.
        </p>
      )}
    </section>
  );
};

export default GenreMangaList;