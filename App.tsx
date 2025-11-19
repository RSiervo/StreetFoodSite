
import React, { useState, useMemo } from 'react';
import { 
  Home, 
  ShoppingCart, 
  ClipboardList, 
  Bot, 
  UserCircle, 
  Search, 
  Settings,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  DollarSign,
  Star,
  Utensils,
  Heart,
  Clock,
  MapPin,
  LogOut,
  Edit2,
  Phone,
  ArrowRight,
  ChefHat,
  Info,
  LayoutDashboard,
  UtensilsCrossed,
  TrendingUp,
  Filter,
  PlusCircle,
  Edit,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Package,
  Globe,
  List,
  Sparkles
} from 'lucide-react';

import { MENU_ITEMS, CATEGORIES, TRANSLATIONS } from './constants';
import { MenuItem, CartItem, Order, Tab, OrderStatus, Review, UserProfile, Language } from './types';
import { FoodCard } from './components/FoodCard';
import { AIChat } from './components/AIChat';
import { OrderTracker } from './components/OrderTracker';
import { ReviewModal } from './components/ReviewModal';
import { AuthModal } from './components/AuthModal';
import { AdminItemModal } from './components/AdminItemModal';
import { AdminCategoryModal } from './components/AdminCategoryModal';

// -- Main Component --
export default function App() {
  // -- User Auth State --
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // -- App State --
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>('en');

  const t = TRANSLATIONS[language];

  // -- AI Modal State --
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // -- Review Modal State --
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetItem, setReviewTargetItem] = useState<{id: string, name: string} | null>(null);

  // -- Admin Dashboard State --
  const [adminView, setAdminView] = useState<'overview' | 'orders' | 'menu'>('overview');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);
  const [orderFilter, setOrderFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  // -- Editing Profile State --
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  // -- Helper: Check Auth --
  const handleProtectedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // -- Handlers --

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    setActiveTab(Tab.HOME);
    setIsAdmin(false);
  };

  const addToCart = (item: MenuItem) => {
    handleProtectedAction(() => {
      setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === itemId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : i;
        }
        return i;
      });
    });
  };

  const toggleFavorite = (itemId: string) => {
    handleProtectedAction(() => {
      setFavorites(prev => 
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: cartTotal,
      status: OrderStatus.PENDING,
      createdAt: Date.now()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setActiveTab(Tab.ORDERS);
    
    // Simulate backend order processing
    setTimeout(() => {
      updateOrderStatus(newOrder.id, OrderStatus.CONFIRMED);
    }, 2000);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // -- Admin Handlers --
  const handleSaveMenuItem = (itemData: Omit<MenuItem, 'reviews' | 'rating'>) => {
    if (editingItem) {
      // Update existing
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemData } 
          : item
      ));
    } else {
      // Create new
      const newItem: MenuItem = {
        ...itemData,
        id: Date.now().toString(),
        rating: 0,
        reviews: []
      };
      setMenuItems(prev => [newItem, ...prev]);
    }
    setIsItemModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const openNewItemModal = () => {
    setEditingItem(undefined);
    setIsItemModalOpen(true);
  };

  // -- Category Handlers --
  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories(prev => [...prev, newCat]);
    }
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    // Update category list
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    // Update items linked to this category
    setMenuItems(prev => prev.map(item =>
      item.category === oldName ? { ...item, category: newName } : item
    ));
    // Update selected category if needed
    if (selectedCategory === oldName) setSelectedCategory(newName);
  };

  const handleDeleteCategory = (name: string) => {
    if (menuItems.some(i => i.category === name)) {
      if (!window.confirm(`Category "${name}" is used by some items. Delete anyway? Items will keep the category name but it won't be in the filter list.`)) {
        return;
      }
    }
    setCategories(prev => prev.filter(c => c !== name));
    if (selectedCategory === name) setSelectedCategory('All');
  };

  // -- Review Handlers --

  const openReviewModal = (item: MenuItem) => {
    setReviewTargetItem({ id: item.id, name: item.name });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    if (!reviewTargetItem) return;
    if (!user) return; 

    const newReview: Review = {
      id: `r-${Date.now()}`,
      userId: user.name,
      userName: user.name,
      rating,
      comment,
      date: Date.now()
    };

    setMenuItems(prevItems => prevItems.map(item => {
      if (item.id === reviewTargetItem.id) {
        const updatedReviews = [newReview, ...item.reviews];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...item,
          reviews: updatedReviews,
          rating: Number(avgRating.toFixed(1))
        };
      }
      return item;
    }));
  };

  const saveAddress = () => {
    if (user && tempAddress) {
      setUser({ ...user, address: tempAddress });
      setIsEditingAddress(false);
    }
  };

  // -- Search History Handlers --

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchHistory(prev => {
        const newHistory = [searchQuery.trim(), ...prev.filter(s => s !== searchQuery.trim())];
        return newHistory.slice(0, 5); // Keep top 5
      });
      e.currentTarget.blur(); // Dismiss keyboard
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const applySearchHistory = (term: string) => {
    setSearchQuery(term);
  };

  // -- Render Views --

  const renderHome = () => {
    const filteredItems = menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="pb-24 animate-fade-in">
        {/* Landing Page Hero Section (Only show if no search) */}
        {!searchQuery && selectedCategory === 'All' && (
           <div className="relative w-full h-[300px] bg-street-dark rounded-b-3xl overflow-hidden mb-6 shadow-xl group">
             <img 
               src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=2070" 
               alt="Filipino Street Food" 
               className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-street-dark via-transparent to-transparent"></div>
             
             <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-street-orange text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                     Est. 2024
                   </span>
                   <div className="flex text-street-yellow">
                     <Star size={12} fill="currentColor" />
                     <Star size={12} fill="currentColor" />
                     <Star size={12} fill="currentColor" />
                     <Star size={12} fill="currentColor" />
                     <Star size={12} fill="currentColor" />
                   </div>
                </div>
                <h1 className="text-3xl font-bold leading-tight mb-2">Pinoy<span className="text-street-orange">Bites</span></h1>
                <p className="text-gray-300 text-sm max-w-[80%] mb-4">
                  {language === 'en' ? 
                    'Experience the best street food in town. From Isaw to Halo-Halo, delivered hot to your bahay!' : 
                    'Tikman ang pinakamasarap na street food. Mula Isaw hanggang Halo-Halo, delivered agad sa bahay niyo!'}
                </p>
                
                {!user && (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-white text-street-dark px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-street-orange hover:text-white transition-colors"
                  >
                    {t.signUpNow} <ArrowRight size={14} />
                  </button>
                )}
             </div>
           </div>
        )}

        {/* About Section (Visible on Home) */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="px-6 mb-8">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                   <Info size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-street-dark text-sm">{t.aboutUs}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {t.aboutText}
                  </p>
                </div>
             </div>
          </div>
        )}

        {/* Search & Menu Header */}
        <div className="px-4 sticky top-0 z-40 bg-street-light/95 backdrop-blur-sm py-2">
          {/* Search Bar */}
          <div className="relative mb-4">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder={t.searchPlaceholder} 
               className="w-full bg-white border border-gray-200 text-street-dark placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-street-orange shadow-sm transition-all"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={handleSearchKeyDown}
             />
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
                  ${selectedCategory === cat 
                    ? 'bg-street-dark text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-street-orange'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches (If active) */}
        {searchHistory.length > 0 && !searchQuery && (
          <div className="px-4 mb-4 animate-slide-up">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} /> {t.recentSearches}
              </h3>
              <button 
                onClick={clearSearchHistory} 
                className="text-[10px] text-street-orange hover:text-red-500 font-medium"
              >
                {t.clear}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => applySearchHistory(term)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600"
                >
                   {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="px-4 grid grid-cols-2 gap-4 mt-2">
          {filteredItems.map(item => (
            <div key={item.id} className="h-full">
              <FoodCard 
                item={item} 
                onAdd={addToCart} 
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
           <div className="text-center p-10 text-gray-400">
             <p>{t.noFoodFound}</p>
           </div>
        )}
      </div>
    );
  };

  const renderCart = () => (
    <div className="p-4 pb-24 h-full flex flex-col animate-fade-in">
      <h2 className="text-2xl font-bold text-street-dark mb-2">{t.myCart}</h2>
      
      {/* Delivery Address Header in Cart */}
      <div className="flex items-start gap-2 text-xs text-gray-500 mb-6 bg-gray-50 p-2 rounded-lg border border-gray-100">
         <MapPin size={14} className="text-street-orange shrink-0 mt-0.5" />
         <div>
            <span className="font-bold text-gray-700">{t.deliveryTo}</span>
            <p className="line-clamp-1">{user?.address}</p>
         </div>
      </div>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center">
          <div className="relative mb-8">
             <div className="w-32 h-32 bg-street-orange/10 rounded-full flex items-center justify-center">
                <ShoppingCart size={56} className="text-street-orange opacity-80" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-street-dark text-white p-3 rounded-2xl shadow-lg border-4 border-street-light transform -rotate-12">
                <Utensils size={24} />
             </div>
          </div>
          
          <h3 className="text-2xl font-bold text-street-dark mb-3">{t.emptyCartTitle}</h3>
          <p className="text-gray-400 mb-8 max-w-[260px] leading-relaxed text-sm">
            {t.emptyCartText}
          </p>
          
          <button 
            onClick={() => setActiveTab(Tab.HOME)} 
            className="bg-street-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all hover:bg-street-orange hover:shadow-orange-500/25 flex items-center gap-3 group"
          >
            <span>{t.browseMenu}</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto space-y-4 no-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3 items-center border border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-grow">
                  <h4 className="font-bold text-street-dark text-sm">{item.name}</h4>
                  <p className="text-street-orange font-bold text-sm">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white shadow text-street-dark rounded hover:text-red-500">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-street-dark shadow text-white rounded hover:bg-street-orange">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 ml-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-auto bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span>{t.subtotal}</span>
              <span>₱{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-gray-500">
              <span>{t.deliveryFee}</span>
              <span>₱45.00</span>
            </div>
            <div className="flex justify-between mb-6 text-lg font-bold text-street-dark border-t pt-2 border-dashed border-gray-200">
              <span>{t.total}</span>
              <span>₱{(cartTotal + 45.00).toFixed(2)}</span>
            </div>
            <button 
              onClick={placeOrder}
              className="w-full bg-street-dark text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {t.checkout} <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="p-4 pb-24 animate-fade-in min-h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-street-dark">{t.myOrders}</h2>
        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
           <ShoppingBag className="text-street-orange" size={20} />
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center mt-10">
          <div className="relative mb-6 group">
             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <ClipboardList size={40} className="text-gray-300 group-hover:text-street-orange transition-colors" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-100 animate-bounce">
                <Utensils size={16} className="text-street-dark" />
             </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2">{t.noPastOrders}</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-[200px]">
             {t.noPastOrdersText}
          </p>
          
          <button 
            onClick={() => setActiveTab(Tab.HOME)} 
            className="bg-street-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all hover:bg-street-orange flex items-center gap-2"
          >
            <ChefHat size={18} />
            <span>{t.orderNow}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map(order => (
            <div key={order.id} className="relative">
              {/* The Tracker Card */}
              <div className="relative z-10">
                <OrderTracker 
                  order={order} 
                  language={language} 
                  onUpdateStatus={updateOrderStatus}
                />
              </div>
              
              {/* The Receipt/Items List (visually connected) */}
              <div className="mx-2 bg-white rounded-b-2xl shadow-sm border-x border-b border-gray-200 -mt-6 pt-8 pb-4 px-4 relative top-0 animate-slide-up z-0">
                
                {/* ZigZag Receipt Top Border Pattern (CSS trick or SVG) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-[linear-gradient(135deg,transparent_50%,rgba(0,0,0,0.05)_50%),linear-gradient(45deg,rgba(0,0,0,0.05)_50%,transparent_50%)] bg-[length:10px_10px] opacity-20"></div>

                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Receipt size={12} /> {t.orderDetails}
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start group">
                       <div className="flex items-start gap-3">
                         {/* Item Icon */}
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-street-orange transition-colors mt-1">
                            <Utensils size={14} />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-700">{item.name}</p>
                           <p className="text-xs text-gray-400">Qty: {item.quantity} • ₱{item.price}</p>
                         </div>
                       </div>
                       
                       {/* Price or Action */}
                       <div className="flex flex-col items-end gap-1">
                         <span className="text-sm font-medium text-gray-600">₱{(item.price * item.quantity).toFixed(2)}</span>
                         
                         {order.status === OrderStatus.DELIVERED && (
                           <button 
                             onClick={() => openReviewModal(item)}
                             className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                           >
                             <Star size={10} /> {t.rate}
                           </button>
                         )}
                       </div>
                    </div>
                  ))}
                </div>

                {/* Total Divider */}
                <div className="my-4 border-t border-dashed border-gray-200"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                     <Clock size={12} />
                     <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                     <span className="text-xs text-gray-400 mr-2">{t.totalPaid}</span>
                     <span className="text-lg font-bold text-street-dark">₱{order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Reorder Button (Visual) */}
                {order.status === OrderStatus.DELIVERED && (
                   <button 
                     onClick={() => {
                        handleProtectedAction(() => {
                           setActiveTab(Tab.HOME); // Just redirect for now
                        });
                     }}
                     className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-street-dark text-xs font-bold rounded-lg border border-gray-200 flex items-center justify-center gap-2 transition-colors group"
                   >
                     <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                     {t.orderAgain}
                   </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => {
    const favItems = menuItems.filter(i => favorites.includes(i.id));

    return (
      <div className="p-4 pb-24 animate-fade-in">
         <h2 className="text-2xl font-bold text-street-dark mb-6">{t.profileSettings}</h2>
         
         {/* User Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-street-orange rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md border-2 border-white">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-lg text-street-dark">{user?.name}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                   <Phone size={10} /> {user?.phone || 'No phone'}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                   <Settings size={10} /> {user?.email || 'No email'}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 bg-street-yellow/10 w-32 h-32 rounded-full z-0"></div>
         </div>

         {/* Address Section */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-street-dark text-sm flex items-center gap-2">
                <MapPin size={16} className="text-street-orange" /> {t.address}
              </h3>
              {!isEditingAddress && (
                <button 
                  onClick={() => {
                    setTempAddress(user?.address || '');
                    setIsEditingAddress(true);
                  }}
                  className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
                >
                  <Edit2 size={12} /> {t.edit}
                </button>
              )}
            </div>
            
            {isEditingAddress ? (
              <div className="mt-2 animate-fade-in">
                <textarea
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-street-orange focus:outline-none resize-none mb-2"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setIsEditingAddress(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    onClick={saveAddress}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-street-dark rounded-lg hover:bg-street-orange transition-colors"
                  >
                    {t.saveAddress}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed">{user?.address}</p>
            )}
         </div>

         {/* Language Selector */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
           <div className="flex items-center gap-2 mb-3">
             <Globe size={16} className="text-street-orange" />
             <h3 className="font-bold text-street-dark text-sm">{t.language}</h3>
           </div>
           <div className="flex gap-2">
             <button
               onClick={() => setLanguage('en')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${language === 'en' ? 'bg-street-dark text-white border-street-dark' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
             >
               {t.english}
             </button>
             <button
               onClick={() => setLanguage('fil')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${language === 'fil' ? 'bg-street-dark text-white border-street-dark' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
             >
               {t.filipino}
             </button>
           </div>
         </div>

         {/* Favorites Section */}
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
               <Heart size={18} className="text-street-orange fill-street-orange" />
               <h3 className="font-bold text-street-dark">{t.myFavorites}</h3>
            </div>
            
            {favItems.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                 {favItems.map(item => (
                   <div key={item.id} className="min-w-[220px] w-[220px]">
                      <FoodCard 
                        item={item} 
                        onAdd={addToCart} 
                        isFavorite={true} 
                        onToggleFavorite={toggleFavorite} 
                      />
                   </div>
                 ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 flex flex-col items-center">
                 <Heart size={24} className="mb-2 opacity-20" />
                 <p className="text-xs">{t.noFavorites}</p>
                 <button 
                   onClick={() => setActiveTab(Tab.HOME)}
                   className="mt-3 text-xs font-bold text-street-orange hover:underline"
                 >
                   {t.browseMenu}
                 </button>
              </div>
            )}
         </div>

         <div className="space-y-3">
            {/* Admin Toggle for Demo */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Settings size={20} />
                  </div>
                  <span className="font-medium text-street-dark">{t.adminMode}</span>
               </div>
               <button 
                 onClick={() => setIsAdmin(!isAdmin)}
                 className={`w-12 h-6 rounded-full transition-colors relative ${isAdmin ? 'bg-street-orange' : 'bg-gray-300'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isAdmin ? 'left-7' : 'left-1'}`}></div>
               </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center text-left hover:bg-red-50 transition-colors group"
            >
               <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-200">
                    <LogOut size={20} />
                  </div>
                  <span className="font-medium text-street-dark group-hover:text-red-600">{t.logOut}</span>
               </div>
               <ChevronRight size={18} className="text-gray-300 group-hover:text-red-300" />
            </button>
         </div>
      </div>
    );
  };

  // -- Admin Views --
  const renderAdminDashboard = () => {
    const activeOrdersCount = orders.filter(o => o.status !== OrderStatus.DELIVERED).length;
    const revenue = orders.reduce((acc, o) => acc + o.total, 0);
    const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
    const avgOrderValue = orders.length > 0 ? (revenue / orders.length) : 0;

    const filteredOrders = orders.filter(o => {
      if (orderFilter === 'All') return true;
      if (orderFilter === 'Active') return o.status !== OrderStatus.DELIVERED;
      if (orderFilter === 'Completed') return o.status === OrderStatus.DELIVERED;
      return true;
    });

    return (
      <div className="p-4 pb-24 animate-fade-in flex flex-col h-full">
         {/* Admin Header */}
         <div className="flex items-center justify-between mb-4 sticky top-0 bg-street-light z-20 pb-2">
           <div>
             <h2 className="text-xl font-bold text-street-dark">{t.dashboard}</h2>
             <p className="text-xs text-gray-400">Welcome back, Chef</p>
           </div>
           <div className="flex gap-2">
             <button 
               onClick={() => setAdminView('overview')}
               className={`p-2 rounded-lg transition-colors ${adminView === 'overview' ? 'bg-street-dark text-white' : 'bg-white text-gray-400'}`}
             >
               <LayoutDashboard size={20} />
             </button>
             <button 
                onClick={() => setAdminView('orders')}
                className={`p-2 rounded-lg transition-colors ${adminView === 'orders' ? 'bg-street-dark text-white' : 'bg-white text-gray-400'}`}
             >
               <ClipboardList size={20} />
             </button>
             <button 
                onClick={() => setAdminView('menu')}
                className={`p-2 rounded-lg transition-colors ${adminView === 'menu' ? 'bg-street-dark text-white' : 'bg-white text-gray-400'}`}
             >
               <UtensilsCrossed size={20} />
             </button>
           </div>
         </div>

         {/* Sub-Views */}
         <div className="flex-grow overflow-y-auto no-scrollbar">
           
           {/* OVERVIEW TAB */}
           {adminView === 'overview' && (
             <div className="animate-slide-up">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{t.activeOrders}</p>
                    <p className="text-2xl font-bold text-street-dark">{activeOrdersCount}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{t.revenue}</p>
                    <p className="text-2xl font-bold text-street-dark">₱{revenue.toFixed(0)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{t.avgOrder}</p>
                    <p className="text-2xl font-bold text-street-dark">₱{avgOrderValue.toFixed(0)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{t.menuItems}</p>
                    <p className="text-2xl font-bold text-street-dark">{menuItems.length}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                   <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={18} className="text-street-orange" />
                      <h3 className="font-bold text-street-dark">{t.quickActions}</h3>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setAdminView('orders')}
                        className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl text-left transition-colors group"
                      >
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                           <ClipboardList size={16} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 block">{t.manageOrders}</span>
                      </button>
                      <button 
                        onClick={() => {
                           setAdminView('menu');
                           openNewItemModal();
                        }}
                        className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl text-left transition-colors group"
                      >
                        <div className="w-8 h-8 bg-orange-100 text-street-orange rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                           <Plus size={16} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 block">{t.addItem}</span>
                      </button>
                   </div>
                </div>
             </div>
           )}

           {/* ORDERS TAB */}
           {adminView === 'orders' && (
             <div className="animate-slide-up">
               {/* Filter Pills */}
               <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                 {(['All', 'Active', 'Completed'] as const).map(filter => (
                   <button
                     key={filter}
                     onClick={() => setOrderFilter(filter)}
                     className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${orderFilter === filter ? 'bg-street-dark text-white' : 'bg-white border border-gray-200 text-gray-500'}`}
                   >
                     {filter}
                   </button>
                 ))}
               </div>

               <div className="space-y-4">
                 {filteredOrders.length === 0 && <p className="text-gray-400 italic text-center mt-10">No orders found.</p>}
                 {filteredOrders.map(order => (
                   <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-street-dark">{order.id.slice(-6)}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                              {order.status}
                           </span>
                        </div>
                        <span className="text-street-orange font-bold">₱{order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="mb-3 bg-gray-50 p-2 rounded-lg">
                        <div className="flex flex-wrap gap-1">
                          {order.items.map(i => (
                            <span key={i.id} className="text-xs text-gray-600">{i.quantity}x {i.name}, </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
                         {Object.values(OrderStatus).map((status) => (
                           <button
                             key={status}
                             onClick={() => updateOrderStatus(order.id, status)}
                             className={`
                               px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors flex-shrink-0
                               ${order.status === status ? 'bg-street-dark text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}
                             `}
                           >
                             {status}
                           </button>
                         ))}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* MENU TAB */}
           {adminView === 'menu' && (
             <div className="animate-slide-up">
               <div className="grid grid-cols-2 gap-2 mb-4">
                  <button 
                    onClick={openNewItemModal}
                    className="py-3 bg-street-dark text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs sm:text-sm"
                  >
                    <PlusCircle size={16} /> {t.addNewItem}
                  </button>
                  <button 
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="py-3 bg-white border border-gray-200 text-street-dark rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs sm:text-sm hover:bg-gray-50"
                  >
                    <List size={16} /> Categories
                  </button>
               </div>

               <div className="space-y-3">
                 {menuItems.map(item => (
                   <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-street-dark text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{item.category} • ₱{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditItemModal(item)}
                          className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-2 bg-gray-50 text-red-500 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>
      </div>
    );
  };

  // -- Navigation Bar --
  const renderNav = () => {
    const tabs = [
      { id: Tab.HOME, icon: Home, label: t.home },
      { id: Tab.CART, icon: ShoppingCart, label: t.cart, badge: cart.length },
      { id: Tab.ORDERS, icon: ClipboardList, label: t.orders },
      { id: Tab.PROFILE, icon: UserCircle, label: t.profile },
    ];

    return (
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 px-4 py-2 pb-safe">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === Tab.HOME) {
                    setActiveTab(tab.id);
                  } else {
                    handleProtectedAction(() => setActiveTab(tab.id));
                  }
                }}
                className={`relative flex flex-col items-center p-2 transition-all ${isActive ? 'text-street-orange scale-105' : 'text-gray-400'}`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-orange-50' : 'bg-transparent'}`}>
                   <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium mt-1">{tab.label}</span>
                
                {tab.badge ? (
                  <span className="absolute top-1 right-1 bg-street-dark text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col max-w-md mx-auto bg-street-light shadow-2xl min-h-screen relative">
      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar h-full">
        {isAdmin && activeTab === Tab.HOME ? (
           renderAdminDashboard()
        ) : (
          <>
             {activeTab === Tab.HOME && renderHome()}
          </>
        )}
        
        {activeTab === Tab.CART && renderCart()}
        {activeTab === Tab.ORDERS && renderOrders()}
        {activeTab === Tab.PROFILE && renderProfile()}
      </div>

      {/* Floating AI Chef Button */}
      {!isAIChatOpen && (
        <button
          onClick={() => {
             handleProtectedAction(() => setIsAIChatOpen(true));
          }}
          className="fixed bottom-24 right-4 z-40 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all animate-bounce focus:outline-none group"
        >
          <Bot size={28} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      )}

      {/* AI Chat Modal */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center pointer-events-none">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
             onClick={() => setIsAIChatOpen(false)}
           ></div>
           
           {/* Modal Content */}
           <div className="bg-white w-full sm:w-[400px] h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto transform transition-transform animate-slide-up flex flex-col">
              <AIChat language={language} onClose={() => setIsAIChatOpen(false)} />
           </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {renderNav()}

      {/* Modals */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        itemName={reviewTargetItem?.name || 'Item'}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        language={language}
      />

      <AdminItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveMenuItem}
        initialData={editingItem}
        categories={categories}
      />

      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAdd={handleAddCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
