from django.db.models.signals import post_save
from django.dispatch import receiver
from .user import User
from .evaluation import Evaluation

# Burada gerekli signal handler'ları eklenebilir
# Örnek:
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        pass  # Gerekli işlemler yapılabilir

@receiver(post_save, sender=Evaluation)
def update_evaluation_stats(sender, instance, created, **kwargs):
    if created:
        pass  # Gerekli işlemler yapılabilir 