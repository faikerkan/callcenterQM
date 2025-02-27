from django.test import TestCase
from backend.core.models import User, Call, Evaluation, EvaluationCriteria
from django.utils import timezone
import datetime

class ModelTests(TestCase):
    def setUp(self):
        # Test kullanıcısı oluştur
        self.admin_user = User.objects.create_superuser(
            username='admin_test',
            email='admin@test.com',
            password='admintest123',
            employee_id='1001',
            role='admin'
        )
        
        self.agent_user = User.objects.create_user(
            username='agent_test',
            email='agent@test.com',
            password='agenttest123',
            employee_id='1002',
            role='agent',
            team='Test Team'
        )
        
        self.expert_user = User.objects.create_user(
            username='expert_test',
            email='expert@test.com',
            password='experttest123',
            employee_id='1003',
            role='expert'
        )
        
        # Test çağrısı oluştur
        self.call = Call.objects.create(
            agent=self.agent_user,
            call_date=timezone.now(),
            phone_number='+905551112233',
            duration=datetime.timedelta(minutes=5, seconds=30),
            mp3_file='test_calls/test.mp3',
            queue='Support',
            status='pending'
        )
        
        # Test değerlendirme kriteri oluştur
        self.criteria = EvaluationCriteria.objects.create(
            name='Test Criterion',
            description='A test criterion',
            weight=50
        )
        
        # Test değerlendirme oluştur
        self.evaluation = Evaluation.objects.create(
            call=self.call,
            evaluator=self.expert_user,
            scores={'1': 80},
            total_score=80,
            comments='Good call',
            improvement_areas='None'
        )
        
    def test_user_creation(self):
        """Kullanıcılar doğru şekilde oluşturuldu mu testi"""
        self.assertEqual(self.admin_user.username, 'admin_test')
        self.assertEqual(self.agent_user.role, 'agent')
        self.assertEqual(self.expert_user.role, 'expert')
        
    def test_call_creation(self):
        """Çağrı kaydı doğru şekilde oluşturuldu mu testi"""
        self.assertEqual(self.call.agent, self.agent_user)
        self.assertEqual(self.call.status, 'pending')
        
    def test_evaluation_creation(self):
        """Değerlendirme doğru şekilde oluşturuldu mu testi"""
        self.assertEqual(self.evaluation.call, self.call)
        self.assertEqual(self.evaluation.evaluator, self.expert_user)
        self.assertEqual(self.evaluation.total_score, 80) 