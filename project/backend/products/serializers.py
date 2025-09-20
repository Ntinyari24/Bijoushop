from rest_framework import serializers
from django.db.models import Avg
from .models import Category, Product, ProductImage, Review, Wishlist

class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'parent',
            'is_active', 'sort_order', 'children', 'product_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

class ProductImageSerializer(serializers.ModelSerializer):
    """Product Image Serializer"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary', 'sort_order']

class ProductListSerializer(serializers.ModelSerializer):
    """Product List Serializer (for listing products)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'price', 'original_price',
            'category', 'category_name', 'brand', 'primary_image', 'is_in_stock',
            'rating_average', 'rating_count', 'discount_percentage', 'is_featured',
            'created_at'
        ]
    
    def get_primary_image(self, obj):
        if obj.images:
            return obj.images[0] if obj.images else None
        primary_image = obj.product_images.filter(is_primary=True).first()
        return primary_image.image_url if primary_image else None

class ProductDetailSerializer(serializers.ModelSerializer):
    """Product Detail Serializer (for single product)"""
    category = CategorySerializer(read_only=True)
    product_images = ProductImageSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    is_wishlisted = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description', 'price',
            'original_price', 'sku', 'stock_quantity', 'category', 'brand',
            'weight', 'dimensions', 'images', 'tags', 'is_active', 'is_featured',
            'rating_average', 'rating_count', 'view_count', 'product_images',
            'reviews', 'is_in_stock', 'is_low_stock', 'discount_percentage',
            'is_wishlisted', 'created_at', 'updated_at'
        ]
    
    def get_reviews(self, obj):
        reviews = obj.reviews.filter(is_approved=True)[:5]  # Latest 5 reviews
        return ReviewSerializer(reviews, many=True).data
    
    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.wishlisted_by.filter(user=request.user).exists()
        return False

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Product Create/Update Serializer"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'short_description', 'price', 'original_price',
            'cost_price', 'sku', 'stock_quantity', 'low_stock_threshold',
            'category', 'brand', 'weight', 'dimensions', 'images', 'tags',
            'meta_title', 'meta_description', 'is_active', 'is_featured'
        ]
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value
    
    def validate(self, attrs):
        if attrs.get('original_price') and attrs.get('price'):
            if attrs['original_price'] < attrs['price']:
                raise serializers.ValidationError("Original price cannot be less than current price")
        return attrs

class ReviewSerializer(serializers.ModelSerializer):
    """Review Serializer"""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_avatar = serializers.CharField(source='user.avatar', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_avatar', 'product', 'rating',
            'title', 'comment', 'is_verified', 'helpful_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified', 'helpful_count', 'created_at', 'updated_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    """Review Create Serializer"""
    
    class Meta:
        model = Review
        fields = ['product', 'rating', 'title', 'comment']
    
    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist Serializer"""
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']
        read_only_fields = ['id', 'created_at']

class WishlistCreateSerializer(serializers.ModelSerializer):
    """Wishlist Create Serializer"""
    
    class Meta:
        model = Wishlist
        fields = ['product']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=validated_data['user'],
            product=validated_data['product']
        )
        return wishlist_item