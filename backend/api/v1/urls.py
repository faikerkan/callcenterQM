from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CallViewSet, EvaluationViewSet, EvaluationCriteriaViewSet

# DefaultRouter kullanarak API endpointleri oluştur
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'calls', CallViewSet)
router.register(r'evaluations', EvaluationViewSet)
router.register(r'criteria', EvaluationCriteriaViewSet)

# API URL patterns
urlpatterns = [
    path('', include(router.urls)),
] 