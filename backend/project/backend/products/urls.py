from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category_detail'),
    
    # Products
    path('', views.ProductListView.as_view(), name='product_list'),
    path('featured/', views.FeaturedProductsView.as_view(), name='featured_products'),
    path('search/', views.ProductSearchView.as_view(), name='product_search'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    
    # Reviews
    path('<uuid:product_id>/reviews/', views.ProductReviewListView.as_view(), name='product_reviews'),
    path('reviews/<uuid:pk>/', views.ProductReviewDetailView.as_view(), name='review_detail'),
    path('reviews/<uuid:review_id>/helpful/', views.mark_review_helpful, name='mark_review_helpful'),
    
    # Wishlist
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<uuid:pk>/', views.WishlistDetailView.as_view(), name='wishlist_detail'),
    path('<uuid:product_id>/wishlist/toggle/', views.toggle_wishlist, name='toggle_wishlist'),
]