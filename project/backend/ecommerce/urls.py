from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'OK',
        'message': 'BijouShop API is running',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_root(request):
    """API root endpoint with available endpoints"""
    return Response({
        'message': 'Welcome to BijouShop API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health/',
            'authentication': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
                'forgot_password': '/api/auth/forgot-password/',
                'reset_password': '/api/auth/reset-password/',
                'change_password': '/api/auth/change-password/',
            },
            'products': '/api/products/',
            'admin': '/admin/',
        }
    }, status=status.HTTP_200_OK)

urlpatterns = [
    # Root redirect to API
    path('', lambda request: redirect('/api/', permanent=False)),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API root
    path('api/', api_root, name='api_root'),
    
    # Health check
    path('health/', health_check, name='health_check'),
    
    # API routes
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    # path('api/orders/', include('orders.urls')),  # URLs file doesn't exist yet
    # path('api/payments/', include('payments.urls')),  # App doesn't exist yet
    # path('api/analytics/', include('analytics.urls')),  # App doesn't exist yet
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "BijouShop Admin"
admin.site.site_title = "BijouShop Admin Portal"
admin.site.index_title = "Welcome to BijouShop Administration"