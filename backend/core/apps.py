from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.core'
    verbose_name = 'Core'

    def ready(self):
        try:
            import backend.core.signals
        except ImportError:
            pass 