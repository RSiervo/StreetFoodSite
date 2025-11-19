import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Spicy Szechuan Noodles',
    description: 'Hand-pulled noodles tossed in fiery chili oil, peanuts, and scallions.',
    price: 8.50,
    category: 'Noodles',
    image: 'https://picsum.photos/seed/noodles1/400/300',
    rating: 4.8,
    reviews: [
      { id: 'r1', userId: 'u2', userName: 'Sarah L.', rating: 5, comment: 'Absolutely fire! 🔥 Best noodles in town.', date: 1715420000000 },
      { id: 'r2', userId: 'u3', userName: 'Mike T.', rating: 4, comment: 'Very spicy but delicious.', date: 1715320000000 }
    ],
    isSpicy: true,
    isVeg: true
  },
  {
    id: '2',
    name: 'Classic Beef Smashburger',
    description: 'Double patty, melted cheddar, caramelized onions, and secret sauce on a brioche bun.',
    price: 12.00,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/burger1/400/300',
    rating: 4.9,
    reviews: [
      { id: 'r3', userId: 'u4', userName: 'Jon D.', rating: 5, comment: 'Perfection on a bun.', date: 1715120000000 }
    ],
    isSpicy: false,
    isVeg: false
  },
  {
    id: '3',
    name: 'Crispy Fish Tacos',
    description: 'Battered cod, slaw, lime crema, and pico de gallo on soft corn tortillas.',
    price: 9.50,
    category: 'Tacos',
    image: 'https://picsum.photos/seed/tacos1/400/300',
    rating: 4.6,
    reviews: [
       { id: 'r4', userId: 'u5', userName: 'Emily R.', rating: 4, comment: 'Fresh and crispy.', date: 1714920000000 }
    ],
    isSpicy: false,
    isVeg: false
  },
  {
    id: '4',
    name: 'Loaded Kimchi Fries',
    description: 'Crispy fries topped with kimchi, spicy mayo, cheese curds, and sesame seeds.',
    price: 7.00,
    category: 'Sides',
    image: 'https://picsum.photos/seed/fries1/400/300',
    rating: 4.7,
    reviews: [],
    isSpicy: true,
    isVeg: true
  },
  {
    id: '5',
    name: 'Chicken Momos',
    description: 'Steamed dumplings filled with spiced chicken, served with tomato chutney.',
    price: 8.00,
    category: 'Dumplings',
    image: 'https://picsum.photos/seed/momo1/400/300',
    rating: 4.5,
    reviews: [],
    isSpicy: false,
    isVeg: false
  },
  {
    id: '6',
    name: 'Falafel Wrap',
    description: 'Crunchy falafel, hummus, tahini, pickles, and fresh greens in a pita.',
    price: 9.00,
    category: 'Wraps',
    image: 'https://picsum.photos/seed/falafel1/400/300',
    rating: 4.4,
    reviews: [],
    isSpicy: false,
    isVeg: true
  }
];

export const CATEGORIES = ['All', 'Burgers', 'Noodles', 'Tacos', 'Dumplings', 'Wraps', 'Sides'];