from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class EvaluationCriteria(models.Model):
    """Değerlendirme kriterleri modeli"""
    name = models.CharField(max_length=100, verbose_name='Kriter Adı')
    description = models.TextField(verbose_name='Açıklama')
    weight = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        verbose_name='Ağırlık (%)'
    )
    
    class Meta:
        verbose_name = 'Değerlendirme Kriteri'
        verbose_name_plural = 'Değerlendirme Kriterleri'
        
    def __str__(self):
        return self.name

class Evaluation(models.Model):
    """Çağrı değerlendirme modeli"""
    call = models.OneToOneField(
        'call.Call',
        on_delete=models.CASCADE,
        related_name='evaluation',
        verbose_name='Çağrı'
    )
    
    evaluator = models.ForeignKey(
        'user.User',
        on_delete=models.CASCADE,
        related_name='evaluations',
        verbose_name='Değerlendiren'
    )
    
    scores = models.JSONField(verbose_name='Puanlar')
    total_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Toplam Puan'
    )
    
    comments = models.TextField(verbose_name='Yorumlar')
    improvement_areas = models.TextField(verbose_name='Gelişim Alanları', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Değerlendirme'
        verbose_name_plural = 'Değerlendirmeler'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.call} - {self.total_score}%" 