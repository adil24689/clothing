import { Product } from '../contexts/AppContext';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1646907334006-5d2a552b6e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwd2VhcmluZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    category: 'T-Shirts',
    brand: 'AmarBrand',
    rating: 4.5,
    reviews: 128,
    description: 'Premium quality cotton t-shirt perfect for everyday wear. Made with 100% organic cotton, this t-shirt offers superior comfort and durability. Features a classic fit that works well with jeans, shorts, or layered under jackets.',
    shortDescription: 'Premium quality cotton t-shirt perfect for everyday wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Gray'],
    inStock: true,
    featured: true,
    trending: true,
    newArrival: false,
    flashSale: {
      discount: 20,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }
  },
  {
    id: '2',
    name: 'Elegant Summer Dress',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1673379789408-8fb16844c594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1673379789408-8fb16844c594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    category: 'Dresses',
    brand: 'ElegantWear',
    rating: 4.8,
    reviews: 89,
    description: 'Beautiful summer dress perfect for casual outings and special occasions. Made with breathable fabric and featuring an elegant design that flatters all body types.',
    shortDescription: 'Beautiful summer dress perfect for casual outings.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Pink', 'White', 'Yellow'],
    inStock: true,
    featured: true,
    trending: false,
    newArrival: true
  },
  {
    id: '3',
    name: 'Premium Denim Jeans',
    price: 3499,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1564400143653-f881883b52df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZWFucyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzUxMjY0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1564400143653-f881883b52df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZWFucyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzUxMjY0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    category: 'Jeans',
    brand: 'DenimCo',
    rating: 4.6,
    reviews: 245,
    description: 'High-quality denim jeans with a perfect fit. Made from premium denim fabric with excellent stretch and recovery. Features classic styling with modern comfort.',
    shortDescription: 'High-quality denim jeans with a perfect fit.',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Dark Blue', 'Light Blue', 'Black', 'Gray'],
    inStock: true,
    featured: false,
    trending: true,
    newArrival: false
  },
  {
    id: '4',
    name: 'Stylish Jacket',
    price: 4999,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1685703206641-2140aea20fc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1NzQ3OTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1685703206641-2140aea20fc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1NzQ3OTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    category: 'Jackets',
    brand: 'StyleHub',
    rating: 4.7,
    reviews: 156,
    description: 'Trendy jacket perfect for layering. Features modern design with high-quality materials and excellent craftsmanship. Suitable for both casual and semi-formal occasions.',
    shortDescription: 'Trendy jacket perfect for layering.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown', 'Gray', 'Navy'],
    inStock: true,
    featured: true,
    trending: false,
    newArrival: true
  }
];

export const categories = [
  { id: '1', name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', count: 45 },
  { id: '2', name: 'Dresses', image: 'https://images.unsplash.com/photo-1673379789408-8fb16844c594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', count: 32 },
  { id: '3', name: 'Jeans', image: 'https://images.unsplash.com/photo-1564400143653-f881883b52df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZWFucyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzUxMjY0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', count: 28 },
  { id: '4', name: 'Jackets', image: 'https://images.unsplash.com/photo-1685703206641-2140aea20fc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1NzQ3OTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', count: 19 },
  { id: '5', name: 'Shirts', image: 'https://images.unsplash.com/photo-1646907334006-5d2a552b6e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwd2VhcmluZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', count: 38 },
  { id: '6', name: 'Accessories', image: 'https://images.unsplash.com/photo-1738458786007-03c0c4b7a804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJyYW5kJTIwbG9nb3N8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', count: 25 }
];

export const brands = [
  { id: '1', name: 'AmarBrand', logo: 'https://images.unsplash.com/photo-1738458786007-03c0c4b7a804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJyYW5kJTIwbG9nb3N8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '2', name: 'ElegantWear', logo: 'https://images.unsplash.com/photo-1738458786007-03c0c4b7a804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJyYW5kJTIwbG9nb3N8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '3', name: 'DenimCo', logo: 'https://images.unsplash.com/photo-1738458786007-03c0c4b7a804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJyYW5kJTIwbG9nb3N8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '4', name: 'StyleHub', logo: 'https://images.unsplash.com/photo-1738458786007-03c0c4b7a804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJyYW5kJTIwbG9nb3N8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
];

export const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1646907334006-5d2a552b6e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwd2VhcmluZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: 'Amazing quality clothes! The fabric is so soft and the fit is perfect. Will definitely shop again.',
    location: 'Dhaka, Bangladesh'
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1646907334006-5d2a552b6e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwd2VhcmluZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: 'Fast delivery and excellent customer service. The clothes look exactly like the pictures.',
    location: 'Chittagong, Bangladesh'
  },
  {
    id: '3',
    name: 'Fatima Ali',
    avatar: 'https://images.unsplash.com/photo-1646907334006-5d2a552b6e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwd2VhcmluZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzU3NTEyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4,
    review: 'Great variety of styles and sizes. Prices are reasonable and quality is good.',
    location: 'Sylhet, Bangladesh'
  }
];

export const banners = [
  {
    id: '1',
    title: 'New Season Collection',
    subtitle: 'Discover the latest trends in fashion',
    image: 'https://images.unsplash.com/photo-1621364654702-e52c549fa43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBiYW5uZXJ8ZW58MXx8fHwxNzU3NTEyNjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    buttonText: 'Shop Now',
    link: '/shop'
  },
  {
    id: '2',
    title: 'Up to 50% Off',
    subtitle: 'Limited time flash sale',
    image: 'https://images.unsplash.com/photo-1753029226995-74b05a344bb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbG90aGluZyUyMHN0b3JlfGVufDF8fHx8MTc1NzUxMjYzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    buttonText: 'Get Deal',
    link: '/flash-sale'
  }
];