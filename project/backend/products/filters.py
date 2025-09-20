# filters.py
import django_filters
from django.db.models import Q
from .models import Product

class ProductFilter(django_filters.FilterSet):
    """Product filtering with slug"""

    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    # Slug filter
    category_slug = django_filters.CharFilter(
        field_name="category__slug", lookup_expr="iexact"
    )

    brand = django_filters.CharFilter(field_name="brand", lookup_expr="iexact")
    min_rating = django_filters.NumberFilter(field_name="rating_average", lookup_expr="gte")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")
    featured = django_filters.BooleanFilter(field_name="is_featured")
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model = Product
        fields = ["category_slug", "brand", "is_featured"]

    def filter_in_stock(self, queryset, name, value):
        return queryset.filter(stock_quantity__gt=0 if value else 0)

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value)
            | Q(description__icontains=value)
            | Q(brand__icontains=value)
            | Q(tags__icontains=value)
        )

