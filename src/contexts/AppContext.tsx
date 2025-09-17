import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  description: string;
  shortDescription: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  flashSale?: {
    discount: number;
    endTime: Date;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: CartItem[];
  shippingAddress: Address;
}

// Context State
interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'bn';
  currency: 'BDT' | 'USD' | 'INR';
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  isAuthenticated: boolean;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  currencyRates: { [key: string]: number };
}

// Actions
type AppAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'bn' }
  | { type: 'SET_CURRENCY'; payload: 'BDT' | 'USD' | 'INR' }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; size: string; color: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' };

// Initial State
const initialState: AppState = {
  theme: 'light',
  language: 'en',
  currency: 'BDT',
  cart: [],
  wishlist: [],
  user: null,
  isAuthenticated: false,
  searchQuery: '',
  viewMode: 'grid',
  currencyRates: {
    BDT: 1,
    USD: 0.009,
    INR: 0.76
  }
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      const newItem: CartItem = {
        id: `${action.payload.product.id}-${action.payload.size}-${action.payload.color}-${Date.now()}`,
        product: action.payload.product,
        quantity: action.payload.quantity,
        size: action.payload.size,
        color: action.payload.color
      };
      
      return { ...state, cart: [...state.cart, newItem] };
    }
    
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload) };
    
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load theme from localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme && savedTheme === 'dark') {
        dispatch({ type: 'TOGGLE_THEME' });
      }
    } catch (e) {
      console.error('Error loading theme:', e);
    }
  }, []);

  // Save theme to localStorage and apply to document
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    } catch (e) {
      console.error('Error saving theme:', e);
    }
  }, [state.theme]);

  // Load other preferences from localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      const savedLanguage = localStorage.getItem('language') as 'en' | 'bn' | null;
      const savedCurrency = localStorage.getItem('currency') as 'BDT' | 'USD' | 'INR' | null;
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');

      if (savedLanguage) {
        dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
      }
      if (savedCurrency) {
        dispatch({ type: 'SET_CURRENCY', payload: savedCurrency });
      }
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          if (Array.isArray(cart)) {
            cart.forEach((item: CartItem) => {
              if (item.product && item.quantity && item.size && item.color) {
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: {
                    product: item.product,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                  }
                });
              }
            });
          }
        } catch (e) {
          console.error('Failed to load cart from localStorage:', e);
          localStorage.removeItem('cart'); // Clear corrupted data
        }
      }
      if (savedWishlist) {
        try {
          const wishlist = JSON.parse(savedWishlist);
          if (Array.isArray(wishlist)) {
            wishlist.forEach((product: Product) => {
              if (product && product.id) {
                dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
              }
            });
          }
        } catch (e) {
          console.error('Failed to load wishlist from localStorage:', e);
          localStorage.removeItem('wishlist'); // Clear corrupted data
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('language', state.language);
      localStorage.setItem('currency', state.currency);
      localStorage.setItem('cart', JSON.stringify(state.cart));
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [state.language, state.currency, state.cart, state.wishlist]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
