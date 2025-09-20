import django_filters
from django.db.models import Q
from .models import Product, Category

class ProductFilter(django_filters.FilterSet):
    """Product filtering"""
    
    # Price range filters
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    # Category filters
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    category_slug = django_filters.CharFilter(field_name='category__slug')
    
    # Brand filter
    brand = django_filters.CharFilter(lookup_expr='iexact')
    
    # Rating filter
    min_rating = django_filters.NumberFilter(field_name='rating_average', lookup_expr='gte')
    
    # Stock filter
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    
    # Featured filter
    featured = django_filters.BooleanFilter(field_name='is_featured')
    
    # Search filter
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Product
        fields = ['category', 'brand', 'is_featured']
    
    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_quantity__gt=0)
        return queryset.filter(stock_quantity=0)
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(brand__icontains=value) |
            Q(tags__icontains=value)
        )