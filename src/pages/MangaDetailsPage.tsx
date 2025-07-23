import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useManga } from '../context/MangaContext';
import { ArrowLeft } from 'lucide-react';
import type { Manga } from '../types/manga';
import LoadingSpinner from '../components/ui/LoadingSpinner';
 

// const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
//   <li className="border p-4 rounded bg-white">
//     <p className="font-medium">{review.username} – {review.rating}/5</p>
//     <p className="text-gray-700">{review.content}</p>
//     <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
//   </li>
// );

interface Character {
  mal_id: number;
  name: string;
  nicknames: string[];
  images: {
    jpg: {
      image_url: string;
    };
  };
  about: string;
  name_kanji: string | null;
}
interface Recommendation {
  id: string;
  mal_id: number;
  title: string;
  coverImage: string;
}


const MangaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getManga, fetchReviews, recentMangaRecommendations, fetchRecentRecommendations } = useManga();

  const [manga, setManga] = useState<Manga | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats,setStats] = useState<any>(null);
  const [similarTo,setSimilarTo] =useState<Recommendation[]>([]);

  // const [rating, setRating] = useState(0);
  // const [username, setUsername] = useState('');
  // const [content, setContent] = useState('');

  const [activeTab, setActiveTab] = useState<'synopsis' | 'characters' | 'stats' | 'similar'> ('synopsis');

  useEffect(() => {
    const local = getManga(id!);
    if (local) setManga(local);

    fetchReviews(id!);
  }, [id, getManga, fetchReviews]);

  useEffect(() => {
    fetchRecentRecommendations();
  }, []);

useEffect(()=>{
   const fetchStats = async () => {


      if (!id) {
        setError('No manga ID provided');
        setIsLoading(false);
        return;
      }

      const local = getManga(id);
      if (local) {
        setManga(local);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch (`https://api.jikan.moe/v4/manga/${id}/statistics`)
        const jsonData = await res.json()
        
        if(!jsonData){
          console.log('no json data')
        }else{
          const statsData = jsonData.data;
           
          setStats(statsData)
        }

      } catch (error) {
        console.error('error fetching stats', error)
      }finally{
         setIsLoading(false);
      }
    
    
    }

    const fetchSetSimilarTo = async () => {
  if (!id) return;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/manga/${id}/recommendations`);
    const json = await res.json();
     
    if (Array.isArray(json.data)) {
      const mapped = json.data.slice(0, 8).map((item: any) => ({
        id: String(item.entry.mal_id),
        mal_id: item.entry.mal_id,
        title: item.entry.title,
        coverImage: item.entry.images?.jpg?.image_url || '/placeholder.svg',
      }));
   
      setSimilarTo(mapped);
    } else {
      console.warn('Unexpected data structure in recommendations');
    }
  } catch (err) {
    console.error('Error fetching manga recommendations:', err);
  }
};

fetchSetSimilarTo()

fetchStats();

},[id])
 
  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('No manga ID provided');
        setIsLoading(false);
        return;
      }

      const local = getManga(id);
      if (local) {
        setManga(local);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
        const json = await res.json();

        if (!json.data) {
          setError('Manga not found');
        } else {
          const d = json.data;
          setManga({
            id: String(d.mal_id),
            title: d.title,
            description: d.synopsis || 'No description available.',
            author: d.authors?.map((a: any) => a.name).join(', ') || 'Unknown',
            coverImage: d.images?.jpg?.image_url || '/placeholder.svg',
            genres: d.genres?.map((g: any) => g.name) || [],
            reviews: [],
            averageRating: d.score || 0,
            publicationYear: d.published?.prop?.from?.year,
            url: d.url || '',
            images: d.images || {},
            approved: d.approved || false,
            titles: d.titles || [],
            title_english: d.title_english || '',
            title_japanese: d.title_japanese || '',
            type: d.type || '',
            mal_id: d.mal_id,
            chapters: d.chapters || 0,
            volumes: d.volumes || 0,
            status: d.status || '',
            publishing: d.publishing || false,
            published: d.published || {},
            score: d.score || 0,
            scored_by: d.scored_by || 0,
            rank: d.rank || 0,
            popularity: d.popularity || 0,
            members: d.members || 0,
            favorites: d.favorites || 0,
            background: d.background || '',
            serializations: d.serializations?.map((s: any) => s.name) || [],
            explicit_genres: d.explicit_genres?.map((g: any) => g.name) || [],
            themes: d.themes?.map((t: any) => t.name) || [],
            demographics: d.demographics?.map((d: any) => d.name) || [],
          });
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load manga details');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, getManga]);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!id) return;

      try {
        const res = await fetch(`https://api.jikan.moe/v4/manga/${id}/characters`);
        const json = await res.json();

        if (!json.data || !Array.isArray(json.data)) return;

        const simplified = json.data.map((charItem: any) => ({
          mal_id: charItem.character.mal_id,
          name: charItem.character.name,
          name_kanji: charItem.character.name_kanji || null,
          nicknames: [],
          about: '',
          images: {
            jpg: {
              image_url: charItem.character.images.jpg.image_url,
            },
          },
        }));

        setCharacters(simplified);
      } catch (error) {
        console.error('Error Fetching Characters:', error);
      }
    };

    fetchCharacters();
  }, [id]);

  // const handleSubmitReview = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!manga || rating < 1 || !username.trim() || !content.trim()) return;

  //   addReview({
  //     mangaId: manga.id,
  //     userId: 'user-' + Date.now(),
  //     username: username.trim(),
  //     rating,
  //     content: content.trim(),
  //   });

  //   setRating(0);
  //   setUsername('');
  //   setContent('');
  // };



  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Loading manga details...</h2>
        <LoadingSpinner fill="red-500" />
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">{error || 'Manga not found'}</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }
 
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-4 sm:py-8 gap-6">
      <main className="flex-1 min-w-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:underline mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="w-full max-w-sm mx-auto lg:max-w-none">
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg"
                onError={e => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = '/placeholder.svg';
                }}
                loading="lazy"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">Quick Summary</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium">Japanese Title:</span> {manga.title_japanese || 'Unknown'}</li>
                <li><span className="font-medium">Type:</span> {manga.type || 'Unknown'}</li>
                <li><span className="font-medium">Rank:</span> {manga.rank || 'Unknown'}</li>
                <li><span className="font-medium">Status:</span> {manga.status || 'Unknown'}</li>
                <li><span className="font-medium">Total Chapters:</span> {manga.chapters || 'Unknown'}</li>
                <li><span className="font-medium">Total Volumes:</span> {manga.volumes || 'Unknown'}</li>
                <li><span className="font-medium">Publishing:</span> {manga.publishing ? 'Yes' : 'No'}</li>
                <li><span className="font-medium">Year Published:</span> {manga.publicationYear || 'Unknown'}</li>
                <li><span className="font-medium">Members:</span> {manga.members || 'Unknown'}</li>
                <li><span className="font-medium">Score:</span> {manga.score || 'Unknown'}</li>
              </ul>
            </div>
          </div>

          <div className="flex-1 space-y-6 w-[]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{manga.title}</h1>
              <h3 className="text-lg sm:text-xl text-gray-600 mb-2">{manga.title_japanese}</h3>
              <p className="text-gray-600">
                by <span className="font-medium">{manga.author}</span>
                {manga.publicationYear && ` (${manga.publicationYear})`}
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                <button
                  onClick={() => setActiveTab('synopsis')}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-t-lg text-sm sm:text-base transition-colors ${
                    activeTab === 'synopsis' 
                      ? 'bg-manga-red text-white border-b-2 border-manga-red' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Synopsis
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-t-lg text-sm sm:text-base transition-colors ${
                    activeTab === 'characters' 
                      ? 'bg-manga-red text-white border-b-2 border-manga-red' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Characters
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-t-lg text-sm sm:text-base transition-colors ${
                    activeTab === 'stats' 
                      ? 'bg-manga-red text-white border-b-2 border-manga-red' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={() => setActiveTab('similar')}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-t-lg text-sm sm:text-base transition-colors ${
                    activeTab === 'similar' 
                      ? 'bg-manga-red text-white border-b-2 border-manga-red' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Similar
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[200px]">
              {activeTab === 'synopsis' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{manga.description}</p>
                </div>
              )}

              {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                    <p className="font-semibold text-manga-red text-lg">{stats.completed || '—'}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                    <p className="font-semibold text-manga-red text-lg">{stats.dropped || '—'}</p>
                    <p className="text-xs text-gray-600">Dropped</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                    <p className="font-semibold text-manga-red text-lg">{stats.on_hold || '—'}</p>
                    <p className="text-xs text-gray-600">On Hold</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                    <p className="font-semibold text-manga-red text-lg">{stats.reading || '—'}</p>
                    <p className="text-xs text-gray-600">Reading</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                    <p className="font-semibold text-manga-red text-lg">{stats.total || '—'}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                    <p className="font-semibold text-manga-red text-lg">{manga.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Score</p>
                  </div>
                </div>
              )}

              {activeTab === 'characters' && (
                <>
                  {characters.length > 0 ? (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold mb-4">Characters</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {characters.map((char: Character) => (
                          <div
                            key={char.mal_id}
                            className="flex flex-col items-center bg-white rounded-lg p-3 shadow transition-transform hover:scale-105"
                          >
                            <img
                              src={char.images.jpg.image_url}
                              alt={char.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2"
                            />
                            <p className="font-semibold text-center text-xs sm:text-sm">{char.name}</p>
                            {char.nicknames.length > 0 && (
                              <p className="text-xs italic text-gray-600 text-center">
                                {char.nicknames.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-8">No characters available.</div>
                  )}
                </>
              )}

              {activeTab === 'similar' && (
                <>
                  {similarTo && similarTo.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {similarTo.map((rec: any) => (
                        <div
                          key={rec.id}
                          className="bg-white rounded-lg shadow hover:scale-105 transition-transform overflow-hidden"
                        >
                          <Link to={`/manga/${rec.mal_id}`}>
                            <img
                              src={rec.coverImage}
                              alt={rec.title}
                              className="w-full h-32 sm:h-40 object-cover"
                            />
                            <div className="p-2">
                              <p className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
                                {rec.title}
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-8">No similar manga found.</p>
                  )}
                </>
              )}
            </div>

            {/* Genres and Rating */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Genres:</p>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.length > 0 ? (
                    manga.genres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-red-200 text-red-700 font-medium px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-gray-400">No genres available.</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Avg. Rating: <span className="font-semibold">{manga.averageRating.toFixed(1)}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar - hidden on mobile, shown on large screens */}
      <aside className="hidden lg:block w-full lg:w-80 xl:w-96 shrink-0">
      <div className="sticky top-4 space-y-6">
        <div className="space-y-2 px-4">
          <h2 className="text-xl xl:text-2xl font-bold text-foreground">Recommended Manga</h2>
          <p className="text-muted-foreground text-sm">Discover your next favorite series</p>
        </div>

        <div className="max-h-96 xl:max-h-[500px] overflow-y-auto px-4 ">
          {recentMangaRecommendations.length > 0 ? (
            <div className="space-y-4 " >
              {recentMangaRecommendations.slice(0, 6).map((rec) => (
                <Link to={`/manga/${rec.mal_id}`} key={rec.mal_id} className="block">
                  <div className="p-3 hover:scale-105 transition-transform duration-200 bg-white rounded-lg shadow cursor-pointer  ">
                    <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{rec.title}</p>
                    <img
                      src={rec.coverImage || '/technicalIssues.png'}
                      alt={`${rec.title} cover`}
                      className="w-full h-32 xl:h-40 rounded-lg object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow h-full flex flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-gray-800 mb-4">Issues loading recommendations...</p>
              <div className="relative w-full max-w-xs">
                <img
                  src="/technicalIssues.png"
                  alt="technical issues"
                  className="w-full h-32 xl:h-40 rounded-lg object-cover brightness-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner fill="red" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 px-4">
          <button
            type="button"
            className="w-full py-2 px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground rounded-md transition-colors border border-gray-200"
            onClick={() => {
               
            }}
          >
            View All Recommendations
          </button>
        </div>
      </div>
    </aside>
      {/* Mobile Recommendations Section */}
      <div className="lg:hidden mt-8 space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Recommended Manga</h2>
          <p className="text-muted-foreground text-sm">Discover your next favorite series</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {recentMangaRecommendations.slice(0, 6).map((rec) => (
            <Link to={`/manga/${rec.mal_id}`} key={rec.mal_id}>
              <div className="bg-white rounded-lg shadow hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={rec.coverImage || '/technicalIssues.png'}
                  alt="manga cover"
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="p-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
                    {rec.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button className="w-full py-2 px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground rounded-md transition-colors border border-gray-200">
          View All Recommendations
        </button>
      </div>
    </div>
  );
};

export default MangaDetailsPage;
