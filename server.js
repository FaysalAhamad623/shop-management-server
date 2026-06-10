const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Fashion E-Commerce API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products'
    }
  });
});

// Seed database with sample data (for development)
app.post('/api/seed', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');

    // Clear existing data
    await Product.deleteMany();
    
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@fashion.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@fashion.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    // Sample products
    const sampleProducts = [
      {
        name: 'Classic White Shirt',
        description: 'A timeless white shirt perfect for any occasion. Made from premium cotton fabric for maximum comfort.',
        price: 49.99,
        originalPrice: 79.99,
        category: 'shirts',
        brand: 'Male Fashion',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
          'https://images.unsplash.com/photo-1596755094514-f87e34085c2c?w=500'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Light Blue', 'Pink'],
        stock: 50,
        rating: 4.5,
        numReviews: 124,
        isFeatured: true,
        isNewArrival: false,
        discount: 37,
        tags: ['casual', 'formal', 'bestseller'],
        createdBy: admin._id
      },
      {
        name: 'Brown Turtleneck Sweater',
        description: 'Cozy turtleneck sweater in a warm brown tone. Perfect for fall and winter collections.',
        price: 89.99,
        originalPrice: 129.99,
        category: 'casual',
        brand: 'Male Fashion',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
        images: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500'
        ],
        sizes: ['M', 'L', 'XL'],
        colors: ['Brown', 'Beige', 'Navy'],
        stock: 35,
        rating: 4.8,
        numReviews: 89,
        isFeatured: true,
        isNewArrival: true,
        discount: 31,
        tags: ['winter', 'sweater', 'trending'],
        createdBy: admin._id
      },
      {
        name: 'Black Casual Hoodie',
        description: 'Comfortable black hoodie with modern design. Features a soft interior lining.',
        price: 69.99,
        originalPrice: 99.99,
        category: 'casual',
        brand: 'Urban Style',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Gray', 'Navy'],
        stock: 60,
        rating: 4.6,
        numReviews: 156,
        isFeatured: false,
        isNewArrival: true,
        discount: 30,
        tags: ['casual', 'hoodie', 'streetwear'],
        createdBy: admin._id
      },
      {
        name: 'Slim Fit Chinos',
        description: 'Modern slim fit chinos in versatile colors. Perfect for both casual and semi-formal occasions.',
        price: 59.99,
        originalPrice: 89.99,
        category: 'pants',
        brand: 'Male Fashion',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
        images: [
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Khaki', 'Navy', 'Black', 'Olive'],
        stock: 45,
        rating: 4.4,
        numReviews: 98,
        isFeatured: false,
        isNewArrival: false,
        discount: 33,
        tags: ['pants', 'chinos', 'versatile'],
        createdBy: admin._id
      },
      {
        name: 'Premium Leather Jacket',
        description: 'Genuine leather jacket with classic design. A wardrobe essential for every modern man.',
        price: 299.99,
        originalPrice: 499.99,
        category: 'jackets',
        brand: 'Luxury Line',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
        ],
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'Brown'],
        stock: 20,
        rating: 4.9,
        numReviews: 67,
        isFeatured: true,
        isNewArrival: false,
        discount: 40,
        tags: ['jacket', 'leather', 'premium'],
        createdBy: admin._id
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish polarized sunglasses with UV protection. Elevate your look with these modern shades.',
        price: 129.99,
        originalPrice: 199.99,
        category: 'accessories',
        brand: 'Vision',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Tortoise', 'Blue'],
        stock: 40,
        rating: 4.7,
        numReviews: 203,
        isFeatured: false,
        isNewArrival: true,
        discount: 35,
        tags: ['accessories', 'sunglasses', 'summer'],
        createdBy: admin._id
      },
      {
        name: 'Casual Sneakers',
        description: 'Comfortable everyday sneakers with a clean, minimalist design. Perfect for any casual outfit.',
        price: 79.99,
        originalPrice: 119.99,
        category: 'shoes',
        brand: 'Urban Step',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
        ],
        sizes: ['8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Gray'],
        stock: 55,
        rating: 4.5,
        numReviews: 178,
        isFeatured: false,
        isNewArrival: false,
        discount: 33,
        tags: ['shoes', 'sneakers', 'casual'],
        createdBy: admin._id
      },
      {
        name: 'Formal Suit Set',
        description: 'Complete 2-piece suit in premium wool blend. Perfect for business meetings and formal events.',
        price: 399.99,
        originalPrice: 599.99,
        category: 'suits',
        brand: 'Executive',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'
        ],
        sizes: ['38', '40', '42', '44'],
        colors: ['Navy', 'Charcoal', 'Black'],
        stock: 25,
        rating: 4.8,
        numReviews: 92,
        isFeatured: true,
        isNewArrival: false,
        discount: 33,
        tags: ['suit', 'formal', 'business'],
        createdBy: admin._id
      }
    ];

    await Product.insertMany(sampleProducts);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      count: sampleProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
