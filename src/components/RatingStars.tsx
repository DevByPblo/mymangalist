import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  size = 'md',
  readOnly = false,
}) => {
  const handleClick = (selectedRating: number) => {
    if (readOnly) return;
    onRatingChange?.(selectedRating);
  };

  const sizeClasses: Record<string, string> = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= rating;

        const classes = [
          starSize,
          'mx-0.5',
          'cursor-pointer',
          'transition-colors',
          isActive ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300',
          !readOnly && 'hover:text-yellow-500',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <Star
            key={index}
            className={classes}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
