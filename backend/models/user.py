from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Özelleştirilmiş kullanıcı modeli"""
    
    class Roles(models.TextChoices):
        EXPERT = 'expert', 'Kalite Uzmanı'
        AGENT = 'agent', 'Müşteri Temsilcisi'
        ADMIN = 'admin', 'Yönetici'
    
    role = models.CharField(
        max_length=10,
        choices=Roles.choices,
        default=Roles.AGENT
    )
    
    team = models.CharField(max_length=50, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    
    class Meta:
        verbose_name = 'Kullanıcı'
        verbose_name_plural = 'Kullanıcılar'
        
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})" 