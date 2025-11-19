
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { CATEGORIES } from '../constants';
import { generateMenuImage } from '../services/geminiService';
import { X, Upload, DollarSign, Type, FileText, Flame, Leaf, Sparkles, Loader2, AlertCircle } from 'lucide-react';

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
  
  const [errors, setErrors] = useState<{name?: string, price?: string}>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Rice Meals', // Default category adjusted to filipino context in constants
        image: '',
        isSpicy: false,
        isVeg: false
      });
    }
    setErrors({}); // Clear errors on open
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: {name?: string, price?: string} = {};
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave({
      id: initialData?.id || '', // ID handled by parent if empty
      name: formData.name!.trim(),
      description: formData.description || '',
      price: Number(formData.price),
      category: formData.category || 'Rice Meals',
      image: formData.image || 'https://picsum.photos/400/300', // Default placeholder
      isSpicy: formData.isSpicy,
      isVeg: formData.isVeg,
    } as MenuItem);
  };

  const handleGenerateImage = async () => {
    if (!formData.name) {
        setErrors(prev => ({...prev, name: "Please enter a name first"}));
        return;
    }
    setErrors({}); // Clear errors if name exists
    setIsGeneratingImage(true);
    try {
      const image = await generateMenuImage(formData.name, formData.description || '');
      if (image) {
        setFormData(prev => ({ ...prev, image }));
      } else {
        alert("Could not generate image. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate image", error);
      alert("Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
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
                  <span className="text-xs">Paste Image URL below or Generate with AI</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1">Image URL</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:hover:bg-indigo-100 transition-colors"
                  title="Generate with AI (Type Name & Description first)"
                >
                  {isGeneratingImage ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 ml-1">
                Tip: Enter Name & Description then click the sparkle icon.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                <Type size={12} /> Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => {
                  setFormData({...formData, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: undefined});
                }}
                placeholder="e.g. Pork Sisig"
                className={`w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none font-bold text-street-dark ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={10} /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                   <span className="font-sans text-base leading-none mr-1">₱</span> Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => {
                    setFormData({...formData, price: Number(e.target.value)});
                    if (errors.price) setErrors({...errors, price: undefined});
                  }}
                  className={`w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none ${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.price && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={10} /> {errors.price}
                  </p>
                )}
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
