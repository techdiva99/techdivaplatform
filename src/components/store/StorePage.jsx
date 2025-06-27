import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Filter, Home, Sparkles } from 'lucide-react';
import TechDivaLogo from '../common/TechDivaLogo'; // ADD THIS IMPORT

const StorePage = ({ onBackToHome, onLogin }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'TechDIVA™ Classic T-Shirt',
      category: 'apparel',
      price: 24.99,
      image: '👕',
      description: 'Soft cotton tee with the iconic TechDIVA™ logo',
      rating: 4.8,
      reviews: 156
    },
    {
      id: 2,
      name: 'TechDIVA™ Code Confidence Mug',
      category: 'accessories',
      price: 14.99,
      image: '☕',
      description: 'Start your day with TechDIVA™ confidence - 15oz ceramic mug',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'TechDIVA™ Planning Notebook',
      category: 'stationery',
      price: 19.99,
      image: '📓',
      description: 'TechDIVA™ goal-setting notebook with inspirational quotes',
      rating: 4.7,
      reviews: 203
    },
    {
      id: 4,
      name: 'TechDIVA™ Wireless Gaming Mouse',
      category: 'tech',
      price: 49.99,
      image: '🖱️',
      description: 'TechDIVA™ branded high-precision wireless mouse',
      rating: 4.6,
      reviews: 124
    },
    {
      id: 5,
      name: 'TechDIVA™ Designer Mouse Pad',
      category: 'tech',
      price: 16.99,
      image: '🎨',
      description: 'TechDIVA™ anti-slip mousepad with motivational design',
      rating: 4.8,
      reviews: 78
    },
    {
      id: 6,
      name: 'TechDIVA™ Mechanical Keyboard',
      category: 'tech',
      price: 129.99,
      image: '⌨️',
      description: 'RGB backlit mechanical keyboard with TechDIVA™ keys',
      rating: 4.9,
      reviews: 45
    },
    {
      id: 7,
      name: 'TechDIVA™ Confidence Lipstick',
      category: 'beauty',
      price: 22.99,
      image: '💄',
      description: 'Bold pink lipstick in signature TechDIVA™ shade',
      rating: 4.7,
      reviews: 312
    },
    {
      id: 8,
      name: 'TechDIVA™ Empowerment Silk Scarf',
      category: 'accessories',
      price: 34.99,
      image: '🧣',
      description: 'Luxurious silk scarf with inspiring TechDIVA™ tech quotes',
      rating: 4.8,
      reviews: 67
    },
    {
      id: 9,
      name: 'TechDIVA™ Code & Stretch Yoga Pants',
      category: 'apparel',
      price: 39.99,
      image: '🧘‍♀️',
      description: 'High-waisted yoga pants with TechDIVA™ tech-inspired prints',
      rating: 4.9,
      reviews: 189
    },
    {
      id: 10,
      name: 'TechDIVA™ Digital Dreams Perfume',
      category: 'beauty',
      price: 45.99,
      image: '🌸',
      description: 'Fresh floral scent inspired by TechDIVA™ innovation',
      rating: 4.6,
      reviews: 94
    },
    {
      id: 11,
      name: 'TechDIVA™ Little Coder\'s Adventure Book',
      category: 'books',
      price: 12.99,
      image: '📚',
      description: 'Children\'s book teaching TechDIVA™ coding concepts through stories',
      rating: 4.9,
      reviews: 267
    },
    {
      id: 12,
      name: 'TechDIVA™ Girls Can Code Collection',
      category: 'books',
      price: 16.99,
      image: '📖',
      description: 'Inspiring stories of young female TechDIVA™ programmers',
      rating: 4.8,
      reviews: 198
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'apparel', name: 'Apparel', count: products.filter(p => p.category === 'apparel').length },
    { id: 'tech', name: 'Tech Gear', count: products.filter(p => p.category === 'tech').length },
    { id: 'beauty', name: 'Beauty', count: products.filter(p => p.category === 'beauty').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length },
    { id: 'stationery', name: 'Stationery', count: products.filter(p => p.category === 'stationery').length },
    { id: 'books', name: 'Children\'s Books', count: products.filter(p => p.category === 'books').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffecf8' }}>
      {/* Header */}
      <nav className="sticky top-0 z-50 px-6 py-4 border-b-4" style={{ borderColor: '#ff67c7', backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToHome}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Sparkles className="w-6 h-6" style={{ color: '#ff67c7' }} />
              <div className="text-2xl font-bold" style={{ color: '#ff67c7' }}>
                TechDIVA<sup className="text-xs">TM</sup>
              </div>
              <span className="text-xl font-bold" style={{ color: '#ff67c7' }}>Store</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToHome}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" 
              style={{ color: '#ff67c7' }}
              title="Back to Home"
            >
              <Home className="w-6 h-6" />
              <span>Home</span>
            </button>
            <button className="px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#0aabde' }}>
              Categories
            </button>
            <button className="px-4 py-2 rounded-full text-xl font-medium hover:bg-pink-100 transition-colors" style={{ color: '#ff9671' }}>
              Sale
            </button>
            <button className="relative p-2 rounded-full hover:bg-pink-100 transition-colors" style={{ color: '#ff67c7' }}>
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-2 text-white rounded-full text-xl font-medium hover:shadow-lg transition-all"
              style={{ backgroundColor: '#ff67c7' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 px-6 text-center" style={{ backgroundColor: '#ff67c7' }}>
        {/* Big TechDIVA Logo */}
        <div className="flex justify-center mb-8">
          <div 
            className="transform transition-transform duration-300"
            style={{
              fontSize: '200%',
              transform: 'scale(2)',
              transformOrigin: 'center',
              lineHeight: '1'
            }}
          >
            <TechDivaLogo size="large" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4">
          TechDIVA<sup className="text-lg" style={{ verticalAlign: 'text-top', position: 'relative', top: '-0.1em' }}>TM</sup> Store
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Empower your journey with our curated collection of tech gear, apparel, and lifestyle products
        </p>
        {cart.length > 0 && (
          <div className="bg-white rounded-full px-6 py-3 inline-block shadow-lg">
            <span className="font-semibold" style={{ color: '#ff67c7' }}>
              Cart Total: ${cartTotal.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="py-8 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Filter className="w-5 h-5" style={{ color: '#ff67c7' }} />
            <span className="font-semibold text-lg" style={{ color: '#ff67c7' }}>Categories</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id 
                    ? 'text-white shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? '#ff67c7' : '#ffecf8',
                  color: selectedCategory === category.id ? '#ffffff' : '#ff67c7'
                }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-12 px-6" style={{ backgroundColor: '#ffecf8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#ffecf8' }}>
                  {product.image}
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg" style={{ color: '#ff67c7' }}>
                      {product.name}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1 rounded-full hover:bg-pink-100 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`}
                        style={{ color: '#ff67c7' }}
                      />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                        style={{ color: '#ff9671' }}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold" style={{ color: '#0aabde' }}>
                      ${product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                      style={{ backgroundColor: '#ff67c7' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ff9671'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ff67c7'}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 px-6 text-center" style={{ backgroundColor: '#ff67c7' }}>
        <p className="text-white text-lg mb-4">Empowering women in tech, one product at a time</p>
        <div className="flex justify-center space-x-6 text-white">
          <button className="hover:opacity-80 transition-opacity">About</button>
          <button className="hover:opacity-80 transition-opacity">Shipping</button>
          <button className="hover:opacity-80 transition-opacity">Returns</button>
          <button className="hover:opacity-80 transition-opacity">Contact</button>
        </div>
        <p className="text-white text-sm mt-6 opacity-80">
          © 2025 TechDIVA™. All rights reserved.
        </p>
        <p className="text-white text-sm mt-2 opacity-70">
          TechDIVA™ is a trademark of TechDIVA™. All product names, logos, and brands are property of their respective owners.
        </p>
      </div>
    </div>
  );
};

export default StorePage;