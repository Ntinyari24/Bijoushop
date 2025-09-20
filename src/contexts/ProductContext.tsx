import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';
import { apiClient } from '../services/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  resetProducts: () => Promise<void>;
  status: Status;
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
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  // --- Normalizer for backend data ---
  const mapBackendProduct = (product: any): Product => ({
    id: Number(product.id) || product.id,
    name: product.name,
    price: parseFloat(product.price),
    description: product.short_description || '',
    image: product.primary_image || '/placeholder-image.jpg',
    category: product.category_name || 'Uncategorized',
    categorySlug:
      product.category_slug ||
      (product.category_name
        ? product.category_name.toLowerCase().replace(/\s+/g, '-')
        : 'uncategorized'),
    rating: product.rating_average ?? 0,
    reviewCount: product.rating_count ?? 0,
    inStock: !!product.is_in_stock,
    tags: Array.isArray(product.tags)
      ? product.tags
      : product.category_slug
      ? [product.category_slug]
      : [],
    variants: [],
  });

  // --- Load cached or static products ---
  const loadStaticProducts = () => {
    const savedProducts = localStorage.getItem('bijouShopProducts');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
      } catch (error) {
        console.error('Error parsing saved products:', error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  };

  // --- Fetch fresh products from backend ---
  const fetchFromBackend = async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await apiClient.getProducts();
      if (response.success && response.data?.results) {
        const backendProducts = response.data.results.map(mapBackendProduct);
        setProducts(backendProducts);
        localStorage.setItem('bijouShopProducts', JSON.stringify(backendProducts));
        setStatus('success');
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      console.error('Failed to fetch products from backend:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  // --- Hybrid: load cache immediately, fetch fresh in background ---
  useEffect(() => {
    loadStaticProducts(); // instant UI
    fetchFromBackend(); // background refresh
  }, []);

  // --- Keep cache updated whenever products change ---
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('bijouShopProducts', JSON.stringify(products));
    }
  }, [products]);

  // --- CRUD operations ---
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => Number(p.id) || 0), 0) + 1;
    const newProduct: Product = { ...productData, id: newId };

    setProducts(prev => [...prev, newProduct]); // optimistic

    try {
      await apiClient.createProduct(newProduct);
      await fetchFromBackend();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product => (product.id === id ? { ...product, ...updates } : product))
    );

    try {
      await apiClient.updateProduct(id, updates);
      await fetchFromBackend();
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const deleteProduct = async (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));

    try {
      await apiClient.deleteProduct(id);
      await fetchFromBackend();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const resetProducts = async () => {
    localStorage.removeItem('bijouShopProducts');
    loadStaticProducts();
    await fetchFromBackend();
  };

  const value: ProductContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    status,
    error,
    fetchFromBackend,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

