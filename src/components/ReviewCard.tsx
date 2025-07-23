
import React from 'react';
import type { Review } from '../types/manga';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold">{review.username}</span>
          <div className="mt-1">
            <RatingStars rating={review.rating} readOnly size="sm" />
          </div>
        </div>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-700 mt-2">{review.content}</p>
    </div>
  );
};

export default ReviewCard;
