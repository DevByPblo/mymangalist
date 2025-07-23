import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Manga } from '../types/manga';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {




  return (
    <Link to={`/manga/${manga.id}`} className="block">
      <div className="manga-card h-full bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
        <div className="relative pb-[140%]">
          <img
            src={manga.coverImage || '/placeholder.svg'}
            alt={manga.title}
            loading='lazy'
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-1 text-gray-800">{manga.title}</h3>
          <span className='' >{manga.title_japanese}</span>
          <p className="text-sm text-gray-600 mb-2 truncate">{manga.author}</p>
          <div className="flex items-center justify-end">
            <Star className="text-yellow-500 h-4 w-4 mr-1" />
            <span className="text-sm font-medium   text-gray-800">{manga.averageRating > 0 ? manga.averageRating.toFixed(1) : 'No ratings'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
