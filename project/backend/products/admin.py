from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, Review, Wishlist

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Category Admin"""
    list_display = ('name', 'slug', 'parent', 'is_active', 'sort_order', 'product_count', 'created_at')
    list_filter = ('is_active', 'parent', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('sort_order', 'name')
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'

class ProductImageInline(admin.TabularInline):
    """Product Image Inline"""
    model = ProductImage
    extra = 1
    fields = ('image_url', 'alt_text', 'is_primary', 'sort_order')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Product Admin"""
    list_display = ('name', 'category', 'price', 'stock_quantity', 'is_active', 'is_featured', 'rating_display', 'created_at')
    list_filter = ('category', 'is_active', 'is_featured', 'brand', 'created_at')
    search_fields = ('name', 'description', 'sku', 'brand')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('rating_average', 'rating_count', 'view_count', 'created_at', 'updated_at')
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'cost_price')
        }),
        ('Inventory', {
            'fields': ('sku', 'stock_quantity', 'low_stock_threshold')
        }),
        ('Product Details', {
            'fields': ('brand', 'weight', 'dimensions', 'images', 'tags')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Statistics', {
            'fields': ('rating_average', 'rating_count', 'view_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def rating_display(self, obj):
        return f"{obj.rating_average}★ ({obj.rating_count})"
    rating_display.short_description = 'Rating'

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Product Image Admin"""
    list_display = ('product', 'image_preview', 'is_primary', 'sort_order', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('product__name', 'alt_text')
    
    def image_preview(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" width="50" height="50" />', obj.image_url)
        return "No Image"
    image_preview.short_description = 'Preview'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Review Admin"""
    list_display = ('user', 'product', 'rating', 'is_verified', 'is_approved', 'helpful_count', 'created_at')
    list_filter = ('rating', 'is_verified', 'is_approved', 'created_at')
    search_fields = ('user__email', 'product__name', 'title', 'comment')
    readonly_fields = ('helpful_count', 'created_at', 'updated_at')
    
    actions = ['approve_reviews', 'disapprove_reviews']
    
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = "Approve selected reviews"
    
    def disapprove_reviews(self, request, queryset):
        queryset.update(is_approved=False)
    disapprove_reviews.short_description = "Disapprove selected reviews"

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    """Wishlist Admin"""
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'product__name')
    raw_id_fields = ('user', 'product')