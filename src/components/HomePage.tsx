import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Timer, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockProducts, categories, brands, testimonials, banners } from '../data/mockData';
import { toast } from 'sonner@2.0.3';

export function HomePage() {
  const { state, dispatch } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [flashSaleTimeLeft, setFlashSaleTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 32 });

  // Auto-advance banner slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Flash sale countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const translations = {
    en: {
      heroTitle: 'Discover Your Style',
      heroSubtitle: 'Premium fashion for every occasion',
      shopNow: 'Shop Now',
      featuredCategories: 'Featured Categories',
      flashSale: 'Flash Sale',
      endsIn: 'Ends in',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      trending: 'Trending Products',
      newArrivals: 'New Arrivals',
      bestSelling: 'Best Selling',
      brands: 'Our Brands',
      testimonials: 'Customer Reviews',
      newsletter: 'Subscribe to Newsletter',
      newsletterText: 'Get updates on new arrivals and exclusive offers',
      subscribe: 'Subscribe',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      viewAll: 'View All'
    },
    bn: {
      heroTitle: 'আপনার স্টাইল আবিষ্কার করুন',
      heroSubtitle: 'প্রতিটি অনুষ্ঠানের জন্য প্রিমিয়াম ফ্যাশন',
      shopNow: 'এখনই কিনুন',
      featuredCategories: 'বিশেষ ক্যাটেগরি',
      flashSale: 'ফ্ল্যাশ সেল',
      endsIn: 'শেষ হবে',
      hours: 'ঘন্টা',
      minutes: 'মিনিট',
      seconds: 'সেকেন্ড',
      trending: 'ট্রেন্ডিং পণ্য',
      newArrivals: 'নতুন আগমন',
      bestSelling: 'বেস্ট সেলিং',
      brands: 'আমাদের ব্র্যান্ড',
      testimonials: 'গ্রাহক রিভিউ',
      newsletter: 'নিউজলেটার সাবস্ক্রাইব করুন',
      newsletterText: 'নতুন আগমন এবং এক্সক্লুসিভ অফারের আপডেট পান',
      subscribe: 'সাবস্ক্রাইব',
      addToCart: 'কার্টে যোগ করুন',
      addToWishlist: 'পছন্দের তালিকায় যোগ করুন',
      viewAll: 'সব দেখুন'
    }
  };

  const t = translations[state.language];

  const formatPrice = (price: number) => {
    const convertedPrice = price * state.currencyRates[state.currency];
    const symbols = { BDT: '৳', USD: '$', INR: '₹' };
    return `${symbols[state.currency]}${convertedPrice.toFixed(0)}`;
  };

  const handleAddToCart = (product: any) => {
    try {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          product,
          quantity: 1,
          size: product.sizes?.[0] || 'M',
          color: product.colors?.[0] || 'Black'
        }
      });
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = (product: any) => {
    try {
      if (state.wishlist.find(item => item.id === product.id)) {
        toast.info('Product already in wishlist!');
        return;
      }
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      toast.success('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.flashSale && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              -{product.flashSale.discount}%
            </Badge>
          )}
          {product.newArrival && (
            <Badge className="absolute top-2 left-2 bg-green-500">
              New
            </Badge>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={() => handleAddToWishlist(product)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              className="w-full"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t.addToCart}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="relative h-full">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="max-w-2xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h1>
                  <p className="text-lg md:text-xl mb-8">{banner.subtitle}</p>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    {banner.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Featured Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t.featuredCategories}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-red-600">{t.flashSale}</h2>
              <div className="flex items-center gap-2 text-red-600">
                <Timer className="h-5 w-5" />
                <span>{t.endsIn}:</span>
                <div className="flex gap-1">
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono">
                    {flashSaleTimeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <span>:</span>
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono">
                    {flashSaleTimeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <span>:</span>
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono">
                    {flashSaleTimeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
              {t.viewAll}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.flashSale).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t.trending}</h2>
            <Button variant="outline">
              {t.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.trending).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t.newArrivals}</h2>
            <Button variant="outline">
              {t.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.newArrival).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Brand Carousel */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">{t.brands}</h2>
          <div className="flex items-center justify-center gap-8 overflow-x-auto pb-4">
            {brands.map((brand) => (
              <div key={brand.id} className="flex-shrink-0 w-32 h-16 bg-white rounded-lg border p-4 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer">
                <ImageWithFallback
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">{t.testimonials}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <div className="flex items-center">
                    <ImageWithFallback
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t.newsletter}</h2>
          <p className="mb-6 opacity-90">{t.newsletterText}</p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-black"
            />
            <Button variant="secondary">
              {t.subscribe}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}