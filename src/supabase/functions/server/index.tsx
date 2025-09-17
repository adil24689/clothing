import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Setup CORS and logging
app.use('*', cors({
  origin: '*',
  credentials: true,
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Initialize storage buckets
async function initializeBuckets() {
  const bucketNames = ['make-bb7a2527-products', 'make-bb7a2527-user-uploads'];
  
  for (const bucketName of bucketNames) {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (error && error.message !== 'The resource already exists') {
          console.error(`Failed to create bucket ${bucketName}:`, error);
        } else if (!error) {
          console.log(`Created bucket: ${bucketName}`);
        } else {
          console.log(`Bucket ${bucketName} already exists`);
        }
      } else {
        console.log(`Bucket ${bucketName} already exists`);
      }
    } catch (error) {
      console.warn(`Bucket initialization warning for ${bucketName}:`, error);
    }
  }
}

// Initialize buckets on startup
initializeBuckets().catch(console.error);

// Auth helper function
async function getUserFromToken(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Routes

// Health check
app.get('/make-server-bb7a2527/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// User Authentication
app.post('/make-server-bb7a2527/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Initialize user data
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name,
      addresses: [],
      createdAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
app.get('/make-server-bb7a2527/user/profile', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ user: userData });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-bb7a2527/user/profile', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const updates = await c.req.json();
    const existingUser = await kv.get(`user:${user.id}`);
    
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const updatedUser = { ...existingUser, ...updates, id: user.id };
    await kv.set(`user:${user.id}`, updatedUser);
    
    return c.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Internal server error while updating profile' }, 500);
  }
});

// Products
app.get('/make-server-bb7a2527/products', async (c) => {
  try {
    const { category, brand, minPrice, maxPrice, inStock, featured, trending, newArrival, search } = c.req.query();
    
    const products = await kv.getByPrefix('product:');
    let filteredProducts = products.map(p => p.value);
    
    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (brand) {
      filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
    }
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }
    if (trending === 'true') {
      filteredProducts = filteredProducts.filter(p => p.trending);
    }
    if (newArrival === 'true') {
      filteredProducts = filteredProducts.filter(p => p.newArrival);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
      );
    }
    
    return c.json({ products: filteredProducts });
  } catch (error) {
    console.error('Products fetch error:', error);
    return c.json({ error: 'Internal server error while fetching products' }, 500);
  }
});

// Get single product
app.get('/make-server-bb7a2527/products/:id', async (c) => {
  try {
    const productId = c.req.param('id');
    const product = await kv.get(`product:${productId}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    // Get product reviews
    const reviews = await kv.getByPrefix(`review:product:${productId}:`);
    const productReviews = reviews.map(r => r.value);
    
    return c.json({ 
      product: { 
        ...product, 
        reviews: productReviews 
      } 
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return c.json({ error: 'Internal server error while fetching product' }, 500);
  }
});

// Add product review
app.post('/make-server-bb7a2527/products/:id/reviews', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const productId = c.req.param('id');
    const { rating, comment } = await c.req.json();
    
    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Invalid rating' }, 400);
    }
    
    const userData = await kv.get(`user:${user.id}`);
    const reviewId = `${Date.now()}-${user.id}`;
    
    const review = {
      id: reviewId,
      productId,
      userId: user.id,
      userName: userData?.name || 'Anonymous',
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString(),
      verified: true // You could add logic to verify purchases
    };
    
    await kv.set(`review:product:${productId}:${reviewId}`, review);
    
    return c.json({ review });
  } catch (error) {
    console.error('Review submission error:', error);
    return c.json({ error: 'Internal server error while submitting review' }, 500);
  }
});

// Orders
app.post('/make-server-bb7a2527/orders', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { items, shippingAddress, paymentMethod, total } = await c.req.json();
    
    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return c.json({ error: 'Missing required order information' }, 400);
    }
    
    const orderId = `ORDER-${Date.now()}-${user.id.slice(0, 8)}`;
    
    const order = {
      id: orderId,
      userId: user.id,
      items,
      shippingAddress,
      paymentMethod,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`order:${orderId}`, order);
    await kv.set(`user:${user.id}:order:${orderId}`, orderId);
    
    return c.json({ order });
  } catch (error) {
    console.error('Order creation error:', error);
    return c.json({ error: 'Internal server error while creating order' }, 500);
  }
});

// Get user orders
app.get('/make-server-bb7a2527/user/orders', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userOrderKeys = await kv.getByPrefix(`user:${user.id}:order:`);
    const orderIds = userOrderKeys.map(k => k.value);
    
    const orders = [];
    for (const orderId of orderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return c.json({ error: 'Internal server error while fetching orders' }, 500);
  }
});

// Get single order
app.get('/make-server-bb7a2527/orders/:id', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const orderId = c.req.param('id');
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    if (order.userId !== user.id) {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    return c.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return c.json({ error: 'Internal server error while fetching order' }, 500);
  }
});

// Wishlist
app.get('/make-server-bb7a2527/user/wishlist', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const wishlistItems = await kv.getByPrefix(`wishlist:${user.id}:`);
    const productIds = wishlistItems.map(item => item.value);
    
    const products = [];
    for (const productId of productIds) {
      const product = await kv.get(`product:${productId}`);
      if (product) {
        products.push(product);
      }
    }
    
    return c.json({ wishlist: products });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return c.json({ error: 'Internal server error while fetching wishlist' }, 500);
  }
});

app.post('/make-server-bb7a2527/user/wishlist/:productId', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const productId = c.req.param('productId');
    const product = await kv.get(`product:${productId}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    await kv.set(`wishlist:${user.id}:${productId}`, productId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Wishlist add error:', error);
    return c.json({ error: 'Internal server error while adding to wishlist' }, 500);
  }
});

app.delete('/make-server-bb7a2527/user/wishlist/:productId', async (c) => {
  try {
    const user = await getUserFromToken(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const productId = c.req.param('productId');
    await kv.del(`wishlist:${user.id}:${productId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Wishlist remove error:', error);
    return c.json({ error: 'Internal server error while removing from wishlist' }, 500);
  }
});

// Initialize sample data
app.post('/make-server-bb7a2527/init-data', async (c) => {
  try {
    // Sample products data
    const sampleProducts = [
      {
        id: '1',
        name: 'Classic Cotton T-Shirt',
        price: 1299,
        originalPrice: 1599,
        image: 'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        images: [
          'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU3NTEyNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        ],
        category: 'T-Shirts',
        brand: 'AmarBrand',
        rating: 4.5,
        reviews: 128,
        description: 'Premium quality cotton t-shirt perfect for everyday wear. Made with 100% organic cotton.',
        shortDescription: 'Premium quality cotton t-shirt perfect for everyday wear.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy', 'Gray'],
        inStock: true,
        featured: true,
        trending: true,
        newArrival: false,
        flashSale: {
          discount: 20,
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
        description: 'Beautiful summer dress perfect for casual outings and special occasions.',
        shortDescription: 'Beautiful summer dress perfect for casual outings.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Pink', 'White', 'Yellow'],
        inStock: true,
        featured: true,
        trending: false,
        newArrival: true
      }
    ];
    
    // Store sample products
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, product);
    }
    
    return c.json({ success: true, message: 'Sample data initialized' });
  } catch (error) {
    console.error('Data initialization error:', error);
    return c.json({ error: 'Internal server error during data initialization' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);