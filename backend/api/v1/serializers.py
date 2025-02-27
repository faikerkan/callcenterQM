from rest_framework import serializers
from backend.core.models import User, Call, Evaluation, EvaluationCriteria

class UserSerializer(serializers.ModelSerializer):
    """
    User modeli için serializer
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'team', 'employee_id', 'is_active']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        """
        Kullanıcı oluşturulurken hashlenmiş şifre oluştur
        """
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        """
        Kullanıcı güncellenirken şifre güncelleme kontrolü
        """
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class CallSerializer(serializers.ModelSerializer):
    """
    Çağrı modeli için serializer
    """
    agent_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Call
        fields = ['id', 'agent', 'agent_name', 'call_date', 'phone_number', 'duration', 
                 'mp3_file', 'queue', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_agent_name(self, obj):
        """
        Temsilcinin tam adını döndür
        """
        return obj.agent.get_full_name() if obj.agent else ''

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    """
    Değerlendirme kriteri modeli için serializer
    """
    class Meta:
        model = EvaluationCriteria
        fields = ['id', 'name', 'description', 'weight']
        read_only_fields = ['id']

class EvaluationSerializer(serializers.ModelSerializer):
    """
    Değerlendirme modeli için serializer
    """
    evaluator_name = serializers.SerializerMethodField()
    call_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Evaluation
        fields = ['id', 'call', 'call_details', 'evaluator', 'evaluator_name', 'scores', 
                 'total_score', 'comments', 'improvement_areas', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_evaluator_name(self, obj):
        """
        Değerlendiren kişinin tam adını döndür
        """
        return obj.evaluator.get_full_name() if obj.evaluator else ''
    
    def get_call_details(self, obj):
        """
        Çağrı detaylarını döndür
        """
        if not obj.call:
            return None
        
        return {
            'id': obj.call.id,
            'agent_name': obj.call.agent.get_full_name() if obj.call.agent else '',
            'call_date': obj.call.call_date,
            'phone_number': obj.call.phone_number,
            'duration': str(obj.call.duration),
        } 