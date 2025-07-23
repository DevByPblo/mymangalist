import React, { useEffect, useState, useRef } from 'react';

interface ExternalReview {
  user: {
    username: string;
  };
  review: string;
  score: number;
  date: string;
}

interface Props {
  mangaId: string;
}

const ExternalReviews: React.FC<Props> = ({ mangaId }) => {
  const [externalReviews, setExternalReviews] = useState<ExternalReview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<{ [key: string]: ExternalReview[] }>({});

  useEffect(() => {
    if (!mangaId) return;

    if (cache.current[mangaId]) {
      setExternalReviews(cache.current[mangaId]);
      setError(null);
      return;
    }

    const fetchExternalReviews = async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/reviews/manga/${mangaId}`);

        if (!res.ok) {
          if (res.status === 429) {
            setError('Too many requests. Please try again later.');
          } else {
            setError(`Failed to fetch reviews: ${res.status}`);
          }
          setExternalReviews([]);
          return;
        }

        const data = await res.json();

        if (data?.data) {
          cache.current[mangaId] = data.data;
          setExternalReviews(data.data);
          setError(null);
        } else {
          setExternalReviews([]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching external reviews', err);
        setExternalReviews([]);
        setError('Error fetching reviews.');
      }
    };

    fetchExternalReviews();
  }, [mangaId]);

  return (
    <div className="mt-10 border-t pt-6 ">
      
      <h3 className="text-xl font-bold mb-4">External Reviews</h3>

      {error ? (
        <p className="text-red-500 italic">{error}</p>
      ) : externalReviews.length > 0 ? (
        <ul className="space-y-4">
          {externalReviews.slice(0, 5).map((review, idx) => (
            <li key={idx} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{review.user.username} – {review.score}/10</p>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{review.review}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No reviews available.</p>
      )}
    </div>
  );
};

export default ExternalReviews;
