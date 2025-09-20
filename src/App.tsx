// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider, useProducts } from './contexts/ProductContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import CategoryFilter from './components/CategoryFilter';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import ProductManagement from './components/ProductManagement';
import BackendTest from './components/BackendTest';
import LearnMorePage from './components/LearnMorePage';
import { Product } from './types';

function ShopPage({
  products,
  selectedProduct,
  setSelectedProduct,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  filteredProducts,
}: {
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  filteredProducts: Product[];
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-jungle-600 to-earth-700 rounded-2xl text-white p-8 md:p-12 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">BijouShop</h1>
          <p className="text-xl md:text-2xl text-jungle-100 mb-6">
            Jewelry that speaks to your style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-jungle-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Shop Now
            </button>
            <Link
              to="/learn-more"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-jungle-600 transition-all duration-200 inline-block text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      <div id="products-section" className="space-y-6 mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={[
            'All',
            ...Array.from(new Set(products.map(p => p.category))).sort()
          ]}
        />
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-jungle-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{filteredProducts.length} products found</span>
            </div>
          </div>
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </main>
  );
}

function AppContent() {
  const { products } = useProducts();
  const { isSeller } = useAuth();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const location = useLocation();

  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory !== 'All') {
      const selectedLower = selectedCategory.toLowerCase();
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedLower ||
        product.category.toLowerCase().includes(selectedLower) ||
        selectedLower.includes(product.category.toLowerCase())
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/' ? 'bg-jungle-600 text-white' : 'text-gray-600 hover:text-jungle-600 hover:bg-jungle-50'
              }`}
            >
              Shop
            </Link>
            {isSeller && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-jungle-600 text-white'
                    : 'text-gray-600 hover:text-jungle-600 hover:bg-jungle-50'
                }`}
              >
                Manage Products
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <ShopPage
              products={products}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredProducts={filteredProducts}
            />
          }
        />
        <Route
          path="/admin"
          element={isSeller ? <ProductManagement /> : <Navigate to="/" replace />}
        />
        <Route
          path="/learn-more"
          element={<LearnMorePage />}
        />
      </Routes>

      <Footer />

      {/* Modals and cart */}
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} />
      <BackendTest />
    </div>
  );
}

function App() {
  return (
    <ProductProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ProductProvider>
  );
}

export default App;
