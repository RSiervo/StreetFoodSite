export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: Review[];
  isSpicy?: boolean;
  isVeg?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  READY = 'Ready',
  DELIVERING = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  estimatedDeliveryTime?: number; // Timestamp
}

export enum Tab {
  HOME = 'HOME',
  CART = 'CART',
  ORDERS = 'ORDERS',
  AI_CHEF = 'AI_CHEF',
  PROFILE = 'PROFILE' // Contains Admin Switch
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}