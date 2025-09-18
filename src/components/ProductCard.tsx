import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants ? product.variants[0] : null
  );
  const [currentImage, setCurrentImage] = useState(product.image);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, selectedVariant || undefined);
  };

  const handleVariantChange = (variant: ProductVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariant(variant);
    setCurrentImage(variant.images[0] || product.image);
  };

  const getCurrentPrice = () => {
    return selectedVariant?.price || product.price;
  };

  return (
    <div
      onClick={() => onProductClick(product)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 hover:border-jungle-200"
    >
      <div className="relative overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            SALE
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-jungle-600 font-medium bg-jungle-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-jungle-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Color Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Colors:</p>
            <div className="flex space-x-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => handleVariantChange(variant, e)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedVariant?.id === variant.id
                      ? 'border-jungle-600 scale-110 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: variant.colorHex || '#ccc' }}
                  title={variant.color}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${getCurrentPrice().toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
              product.inStock
                ? 'bg-gradient-to-r from-jungle-600 to-earth-700 text-white hover:from-jungle-700 hover:to-earth-800 hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;