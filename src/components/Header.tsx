import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { AuthDialog } from './AuthDialog';
import { categories } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export function Header() {
  const { state, dispatch } = useApp();
  const { signOut } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (language: 'en' | 'bn') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const handleCurrencyChange = (currency: 'BDT' | 'USD' | 'INR') => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const handleAuthAction = (action: 'login' | 'register' | 'logout') => {
    if (action === 'logout') {
      handleLogout();
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Logged out successfully');
    } else {
      toast.error('Logout failed');
    }
  };

  const translations = {
    en: {
      search: 'Search products...',
      categories: 'Categories',
      men: 'Men',
      women: 'Women',
      kids: 'Kids',
      sale: 'Sale',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      myAccount: 'My Account',
      orders: 'Orders',
      wishlist: 'Wishlist',
      logout: 'Logout'
    },
    bn: {
      search: 'পণ্য খুঁজুন...',
      categories: 'ক্যাটেগরি',
      men: 'পুরুষ',
      women: 'মহিলা',
      kids: 'শিশু',
      sale: 'সেল',
      about: 'সম্পর্কে',
      contact: 'যোগাযোগ',
      login: 'লগইন',
      register: 'নিবন্ধন',
      myAccount: 'আমার অ্যাকাউন্ট',
      orders: 'অর্ডার',
      wishlist: 'পছন্দের তালিকা',
      logout: 'লগআউট'
    }
  };

  const t = translations[state.language];

  const formatPrice = (price: number) => {
    const convertedPrice = price * state.currencyRates[state.currency];
    const symbols = { BDT: '৳', USD: '$', INR: '₹' };
    return `${symbols[state.currency]}${convertedPrice.toFixed(0)}`;
  };

  const MegaMenu = () => (
    <div className="absolute left-0 top-full w-full bg-background border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-medium text-center">{category.name}</h3>
              <p className="text-sm text-muted-foreground text-center">{category.count} items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      {/* Top Bar */}
      <div className="border-b bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden md:block">
              Free shipping on orders over ৳2000 | Call: +880 1234-567890
            </div>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <Globe className="h-4 w-4 mr-1" />
                    {state.language.toUpperCase()}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('bn')}>
                    বাংলা
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Currency Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    {state.currency}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCurrencyChange('BDT')}>
                    BDT (৳)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCurrencyChange('USD')}>
                    USD ($)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCurrencyChange('INR')}>
                    INR (₹)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                className="h-auto p-1"
              >
                {state.theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-4 mt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Categories</h3>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                        <img src={category.image} alt={category.name} className="w-8 h-8 rounded object-cover" />
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg">
                <span className="font-bold text-lg">AmarShop</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t.search}
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="pl-10 pr-4"
              />
            </div>
            
            {/* Search Suggestions */}
            {isSearchFocused && state.searchQuery && (
              <div className="absolute top-full left-0 right-0 bg-background border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                <div className="p-2">
                  <div className="text-sm text-muted-foreground mb-2">Search suggestions</div>
                  <div className="space-y-1">
                    <div className="p-2 hover:bg-muted rounded cursor-pointer">T-shirts</div>
                    <div className="p-2 hover:bg-muted rounded cursor-pointer">Dresses</div>
                    <div className="p-2 hover:bg-muted rounded cursor-pointer">Jeans</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="h-5 w-5" />
              {state.wishlist.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {state.wishlist.length}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {state.cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {state.cart.length}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {state.isAuthenticated ? (
                  <>
                    <DropdownMenuItem>{t.myAccount}</DropdownMenuItem>
                    <DropdownMenuItem>{t.orders}</DropdownMenuItem>
                    <DropdownMenuItem>{t.wishlist}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAuthAction('logout')}>
                      {t.logout}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleAuthAction('login')}>
                      {t.login}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAuthAction('register')}>
                      {t.register}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-8 py-3">
            <div className="relative group">
              <Button variant="ghost" className="font-medium">
                {t.categories}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <MegaMenu />
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost">{t.men}</Button>
              <Button variant="ghost">{t.women}</Button>
              <Button variant="ghost">{t.kids}</Button>
              <Button variant="ghost" className="text-destructive">{t.sale}</Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </header>
  );
}
