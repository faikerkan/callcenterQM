"""
URL configuration for Call Center Quality Management System.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('api/v1/', include('backend.api.v1.urls')),
    
    # Catch-all route for SPA
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
]

# Media ve static dosyaları için geliştirme ortamında URL'ler ekle
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
