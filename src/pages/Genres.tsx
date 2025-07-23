import React, { useState, useEffect } from "react";
import { useManga } from '../context/MangaContext';
import { Link } from "react-router-dom";

interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [genreCount, setGenreCount] = useState<number>(0);

  const { nsfwEnabled } = useManga();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/genres/manga");
        const json = await response.json();

        if (Array.isArray(json.data)) {
          const rawGenres = json.data as Genre[];

          const uniqueGenres = Array.from(
            new Map(rawGenres.map((g) => [g.mal_id, g])).values()
          );

          uniqueGenres.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
          );

          const nsfwGenres = [9, 12];

          setGenres(
            nsfwEnabled
              ? uniqueGenres.filter((genre) => !nsfwGenres.includes(genre.mal_id))
              : uniqueGenres
          );
          setGenreCount(uniqueGenres.length);
        } else {
          setError("Unexpected API response");
        }
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        setError("Failed to load genres.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [nsfwEnabled]);

  if (loading) return <p className="p-4 text-center text-sm sm:text-base">Loading genres…</p>;
  
  if (error) return (
    <div className="flex justify-center items-center min-h-[50vh] px-4">
      <div className="flex flex-col items-center shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border p-4 sm:p-6 max-w-md w-full">
        <p className="text-center text-red-500 font-bold text-sm sm:text-base mb-4">
          There seems to be a problem... Please Reload the Page
        </p>
        <img 
          src="https://staticg.sportskeeda.com/editor/2024/02/81df7-17071006255995-1920.jpg" 
          alt='zoro sleeping' 
          className="w-full max-w-xs rounded-2xl"
        />
      </div>
    </div>
  );

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
        Manga Genres ({genreCount})
      </h2>

      <div className="mb-6 sm:mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search genres…"
          className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
        />
      </div>

      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {filtered.map((genre, idx) => (
          <li className="transition-transform duration-200 ease-in-out hover:scale-105" key={idx}>
            <Link
              to={`/genre/${genre.mal_id}`}
              className="block bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 group"
            >
              <p className="font-medium text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2 group-hover:text-red-600 transition-colors">
                {genre.name}
              </p>
              <div className="text-xs sm:text-sm text-gray-500">
                {genre.count.toLocaleString()} titles
              </div>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-full text-center text-gray-500 py-8 sm:py-12">
            <p className="text-sm sm:text-base">
              No genres match "<em className="font-semibold">{search}</em>"
            </p>
          </li>
        )}
      </ul>
    </section>
  );
};

export default Genres;