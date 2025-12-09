import { create } from 'zustand';
import { CartItem, Product, User } from '../types';

interface Store {
  // Cart state
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // UI state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<Store>((set, get) => ({
  // Cart state
  cart: [],
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },
  
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item.product._id !== productId) });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set({
      cart: get().cart.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    });
  },
  
  clearCart: () => set({ cart: [] }),
  
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },
  
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // UI state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));