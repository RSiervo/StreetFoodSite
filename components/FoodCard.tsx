import React from 'react';
import { MenuItem } from '../types';
import { Plus, Flame, Leaf, Star, Heart } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAdd, isFavorite = false, onToggleFavorite }) => {
  const reviewCount = item.reviews.length;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-street-gray/50 relative group">
      <div className="relative h-32 sm:h-40 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Tags (Top Left) */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isSpicy && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
              <Flame size={10} fill="currentColor" /> Spicy
            </span>
          )}
          {item.isVeg && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
              <Leaf size={10} fill="currentColor" /> Veg
            </span>
          )}
        </div>

        {/* Favorite Button (Top Right) */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(item.id);
            }}
            className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all active:scale-95"
            aria-label="Toggle favorite"
          >
            <Heart
              size={16}
              className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-street-dark leading-tight line-clamp-2 text-sm sm:text-base">{item.name}</h3>
          <div className="flex items-center text-xs font-medium text-street-orange bg-street-orange/10 px-1.5 py-0.5 rounded shrink-0">
             <Star size={10} className="mr-0.5 fill-current" />
             {item.rating.toFixed(1)} <span className="text-gray-400 ml-0.5 font-normal">({reviewCount})</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-grow">{item.description}</p>
        
        {/* Latest Review Snippet */}
        {reviewCount > 0 && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-500 italic line-clamp-1">"{item.reviews[0].comment}"</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-lg text-street-dark">${item.price.toFixed(2)}</span>
          <button 
            onClick={() => onAdd(item)}
            className="bg-street-dark text-white p-2 rounded-full active:scale-95 transition-transform hover:bg-street-orange focus:outline-none focus:ring-2 focus:ring-street-orange focus:ring-offset-1"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};