import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabaseClient';
import { Product, User, Order, Address } from '../contexts/AppContext';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-bb7a2527`;

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  user?: User;
  order?: Order;
  orders?: Order[];
  products?: Product[];
  product?: Product;
  wishlist?: Product[];
  review?: any;
  [key: string]: any;
}

class ApiClient {
  private async getHeaders(includeAuth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = `Bearer ${publicAnonKey}`;
      }
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    return headers;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Add timeout to prevent hanging
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Auth token timeout')), 2000)
      );
      
      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]);
      
      if (error) {
        console.warn('Failed to get session:', error);
        return null;
      }
      return session?.access_token || null;
    } catch (e) {
      console.warn('Auth token retrieval failed, using anon key:', e);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    includeAuth: boolean = false
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const headers = await this.getHeaders(includeAuth);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      console.warn(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest('/health');
  }

  // Authentication
  async signup(email: string, password: string, name: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // User Profile
  async getUserProfile(): Promise<ApiResponse> {
    return this.makeRequest('/user/profile', {}, true);
  }

  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse> {
    return this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }, true);
  }

  // Products
  async getProducts(filters?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    trending?: boolean;
    newArrival?: boolean;
    search?: string;
  }): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.makeRequest(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/products/${id}`);
  }

  async addProductReview(productId: string, rating: number, comment?: string): Promise<ApiResponse> {
    return this.makeRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }, true);
  }

  // Orders
  async createOrder(orderData: {
    items: any[];
    shippingAddress: Address;
    paymentMethod: string;
    total: number;
  }): Promise<ApiResponse> {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }, true);
  }

  async getUserOrders(): Promise<ApiResponse> {
    return this.makeRequest('/user/orders', {}, true);
  }

  async getOrder(orderId: string): Promise<ApiResponse> {
    return this.makeRequest(`/orders/${orderId}`, {}, true);
  }

  // Wishlist
  async getUserWishlist(): Promise<ApiResponse> {
    return this.makeRequest('/user/wishlist', {}, true);
  }

  async addToWishlist(productId: string): Promise<ApiResponse> {
    return this.makeRequest(`/user/wishlist/${productId}`, {
      method: 'POST',
    }, true);
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse> {
    return this.makeRequest(`/user/wishlist/${productId}`, {
      method: 'DELETE',
    }, true);
  }

  // Initialize sample data
  async initializeData(): Promise<ApiResponse> {
    return this.makeRequest('/init-data', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();

// Helper functions for common operations
export const apiHelpers = {
  // Format API errors for user display
  formatError: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'An unexpected error occurred';
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await apiClient.getAuthToken();
    return !!token;
  },

  // Clear stored auth data
  clearAuth: async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Error during auth cleanup:', error);
    }
  },

  // Store auth token (handled by Supabase automatically)
  setAuthToken: (token: string): void => {
    // This is now handled automatically by Supabase
    console.log('Auth token management is handled by Supabase');
  }
};

// Create a singleton instance
const apiClient = new ApiClient();
export { apiClient };
