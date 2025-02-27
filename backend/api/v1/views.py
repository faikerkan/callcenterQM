from rest_framework import viewsets, permissions
from backend.core.models import User, Call, Evaluation, EvaluationCriteria
from .serializers import UserSerializer, CallSerializer, EvaluationSerializer, EvaluationCriteriaSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    Kullanıcı API endpointi
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Kullanıcı rolüne göre farklı queryset döndür:
        - Admin: Tüm kullanıcılar
        - Expert: Kendi ve Agent'lar
        - Agent: Sadece kendisi
        """
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return User.objects.all().order_by('-date_joined')
        elif user.role == 'expert':
            return User.objects.filter(role__in=['agent', 'expert']).order_by('-date_joined')
        # Agent sadece kendini görebilir
        return User.objects.filter(id=user.id)

class CallViewSet(viewsets.ModelViewSet):
    """
    Çağrı kayıtları API endpointi
    """
    queryset = Call.objects.all().order_by('-call_date')
    serializer_class = CallSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Kullanıcı rolüne göre farklı queryset döndür:
        - Admin/Expert: Tüm çağrılar
        - Agent: Sadece kendi çağrıları
        """
        user = self.request.user
        if user.is_superuser or user.role in ['admin', 'expert']:
            return Call.objects.all().order_by('-call_date')
        # Agent sadece kendi çağrılarını görebilir
        return Call.objects.filter(agent=user).order_by('-call_date')

class EvaluationViewSet(viewsets.ModelViewSet):
    """
    Değerlendirme API endpointi
    """
    queryset = Evaluation.objects.all().order_by('-created_at')
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Kullanıcı rolüne göre farklı queryset döndür:
        - Admin: Tüm değerlendirmeler
        - Expert: Kendi yaptığı değerlendirmeler
        - Agent: Kendi çağrılarının değerlendirmeleri
        """
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Evaluation.objects.all().order_by('-created_at')
        elif user.role == 'expert':
            return Evaluation.objects.filter(evaluator=user).order_by('-created_at')
        # Agent sadece kendi çağrılarının değerlendirmelerini görebilir
        return Evaluation.objects.filter(call__agent=user).order_by('-created_at')

class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    """
    Değerlendirme kriterleri API endpointi
    """
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """
        Sadece admin kullanıcılar değerlendirme kriterlerini oluşturabilir ve düzenleyebilir
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions() 