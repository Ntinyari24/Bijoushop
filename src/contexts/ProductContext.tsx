import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';
import { apiClient } from '../services/api';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
  loading: boolean;
  error: string | null;
  fetchFromBackend: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Django backend
  const fetchFromBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProducts();
      if (response.success && response.data?.results) {
        // Convert Django products to frontend format (align with ProductListSerializer)
        const backendProducts = response.data.results.map((product: any) => ({
          id: parseInt(product.id),
          name: product.name,
          price: parseFloat(product.price),
          description: product.short_description || '',
          image: product.primary_image || '/placeholder-image.jpg',
          category: product.category_name || 'Uncategorized',
          rating: typeof product.rating_average === 'number' ? product.rating_average : 4.5,
          reviewCount: typeof product.rating_count === 'number' ? product.rating_count : 40,
          inStock: !!product.is_in_stock,
          tags: Array.isArray(product.tags) ? product.tags : (product.category_name ? [String(product.category_name).toLowerCase()] : []),
          variants: [],
        }));
        setProducts(backendProducts);
        localStorage.setItem('bijouShopProducts', JSON.stringify(backendProducts));
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      console.error('Failed to fetch products from backend:', err);
      setError(err.message);
      // Fallback to static data
      loadStaticProducts();
    } finally {
      setLoading(false);
    }
  };

  // Load static products (fallback)
  const loadStaticProducts = () => {
    const savedProducts = localStorage.getItem('bijouShopProducts');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error parsing saved products:', error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  };

  // Load products on mount - try backend first, fallback to static
  useEffect(() => {
    fetchFromBackend();
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('bijouShopProducts', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    localStorage.removeItem('bijouShopProducts');
  };

  const value: ProductContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    loading,
    error,
    fetchFromBackend,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
