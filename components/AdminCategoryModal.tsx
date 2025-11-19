import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, AlertCircle } from 'lucide-react';

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAdd: (category: string) => void;
  onEdit: (oldName: string, newName: string) => void;
  onDelete: (category: string) => void;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      // Simple check to prevent duplicates
      if (categories.includes(newCategory.trim())) {
        alert('Category already exists');
        return;
      }
      onAdd(newCategory.trim());
      setNewCategory('');
    }
  };

  const startEdit = (cat: string) => {
    setEditingCategory(cat);
    setEditValue(cat);
  };

  const saveEdit = () => {
    if (editingCategory && editValue.trim() && editValue !== editingCategory) {
      if (categories.includes(editValue.trim())) {
        alert('Category name already taken');
        return;
      }
      onEdit(editingCategory, editValue.trim());
    }
    setEditingCategory(null);
    setEditValue('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-street-dark text-lg">Manage Categories</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Add New Category */}
        <div className="p-4 border-b border-gray-100 bg-white">
           <form onSubmit={handleAdd} className="flex gap-2">
             <input
               type="text"
               value={newCategory}
               onChange={(e) => setNewCategory(e.target.value)}
               placeholder="New Category Name..."
               className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-street-orange focus:outline-none transition-all"
             />
             <button
               type="submit"
               disabled={!newCategory.trim()}
               className="bg-street-dark text-white p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-street-orange transition-colors shadow-sm"
             >
               <Plus size={20} />
             </button>
           </form>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 no-scrollbar bg-gray-50/50">
          {categories.filter(c => c !== 'All').map(cat => (
            <div key={cat} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl shadow-sm group hover:border-street-orange/30 transition-colors">
              {editingCategory === cat ? (
                <div className="flex items-center gap-2 flex-grow animate-fade-in">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow bg-white border-2 border-street-orange rounded-lg px-3 py-1.5 text-sm focus:outline-none font-bold text-street-dark"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditingCategory(null)} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-bold text-street-dark text-sm pl-1">{cat}</span>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(cat)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {categories.length <= 1 && (
             <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No custom categories yet.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};