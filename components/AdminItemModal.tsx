
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { CATEGORIES } from '../constants';
import { X, Upload, DollarSign, Type, FileText, Flame, Leaf } from 'lucide-react';

interface AdminItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'reviews' | 'rating'>) => void;
  initialData?: MenuItem;
}

export const AdminItemModal: React.FC<AdminItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Burgers',
    image: '',
    isSpicy: false,
    isVeg: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Burgers',
        image: '',
        isSpicy: false,
        isVeg: false
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!formData.name || !formData.price) return;
    
    onSave({
      id: initialData?.id || '', // ID handled by parent if empty
      name: formData.name,
      description: formData.description || '',
      price: Number(formData.price),
      category: formData.category || 'Burgers',
      image: formData.image || 'https://picsum.photos/400/300', // Default placeholder
      isSpicy: formData.isSpicy,
      isVeg: formData.isVeg,
    } as MenuItem);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-street-dark text-lg">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          <form id="item-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Image Preview */}
            <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs">Paste Image URL below</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                placeholder="https://..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                <Type size={12} /> Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Pork Sisig"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none font-bold text-street-dark"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                   <span className="font-sans text-base leading-none mr-1">₱</span> Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none appearance-none"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                <FileText size={12} /> Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none resize-none h-20"
                placeholder="Describe the ingredients and taste..."
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, isSpicy: !formData.isSpicy})}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.isSpicy ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                <Flame size={14} className={formData.isSpicy ? 'fill-current' : ''} />
                Spicy
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({...formData, isVeg: !formData.isVeg})}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.isVeg ? 'bg-green-50 border-green-200 text-green-500' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                <Leaf size={14} className={formData.isVeg ? 'fill-current' : ''} />
                Veg
              </button>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="item-form"
            className="flex-[2] py-3 rounded-xl font-bold text-white bg-street-dark hover:bg-street-orange shadow-lg transition-colors text-sm"
          >
            {initialData ? 'Save Changes' : 'Create Item'}
          </button>
        </div>
      </div>
    </div>
  );
};
