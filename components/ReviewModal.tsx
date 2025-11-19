import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  itemName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, itemName }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-street-dark bg-gray-100 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-street-dark mb-1">Rate your meal</h3>
          <p className="text-sm text-gray-500">How was the <span className="font-semibold text-street-orange">{itemName}</span>?</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transform hover:scale-110 transition-transform"
              >
                <Star 
                  size={32} 
                  className={`${(hoveredRating || rating) >= star ? 'fill-street-yellow text-street-yellow' : 'text-gray-300'}`} 
                />
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a short review..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none resize-none h-24"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-street-dark text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform hover:bg-street-orange"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};