from django.db.models.signals import post_save
from django.dispatch import receiver

# Signals kullanım örnekleri (model importları Django hazır olduğunda yapılmalı)
@receiver(post_save, sender='core.User')
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        pass  # Gerekli işlemler yapılabilir

@receiver(post_save, sender='core.Evaluation')
def update_evaluation_stats(sender, instance, created, **kwargs):
    if created:
        pass  # Gerekli işlemler yapılabilir 