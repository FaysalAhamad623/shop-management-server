const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, featured, newArrivals } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (newArrivals === 'true') {
      query.isNewArrival = true;
    }

    // Execute query
    let products = Product.find(query);

    // Sort
    if (sort === 'price-asc') {
      products = products.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      products = products.sort({ price: -1 });
    } else if (sort === 'name') {
      products = products.sort({ name: 1 });
    } else if (sort === 'rating') {
      products = products.sort({ rating: -1 });
    } else {
      products = products.sort({ createdAt: -1 });
    }

    const result = await products;

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


