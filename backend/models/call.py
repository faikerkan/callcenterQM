from django.db import models
from django.core.validators import FileExtensionValidator

class Call(models.Model):
    """Çağrı kayıtları modeli"""
    
    class CallStatus(models.TextChoices):
        PENDING = 'pending', 'Değerlendirilecek'
        IN_PROGRESS = 'in_progress', 'Değerlendiriliyor'
        COMPLETED = 'completed', 'Tamamlandı'
    
    agent = models.ForeignKey(
        'user.User',
        on_delete=models.CASCADE,
        related_name='calls',
        verbose_name='Müşteri Temsilcisi'
    )
    
    call_date = models.DateTimeField(verbose_name='Çağrı Tarihi')
    phone_number = models.CharField(max_length=20, verbose_name='Telefon Numarası')
    duration = models.DurationField(verbose_name='Çağrı Süresi')
    
    mp3_file = models.FileField(
        upload_to='call_records/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['mp3'])],
        verbose_name='Ses Kaydı'
    )
    
    queue = models.CharField(max_length=50, verbose_name='Çağrı Kuyruğu')
    status = models.CharField(
        max_length=20,
        choices=CallStatus.choices,
        default=CallStatus.PENDING,
        verbose_name='Durum'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Çağrı'
        verbose_name_plural = 'Çağrılar'
        ordering = ['-call_date']
        
    def __str__(self):
        return f"{self.agent.get_full_name()} - {self.call_date.strftime('%Y-%m-%d %H:%M')}" 