from django.apps import AppConfig


class ModelsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.models'
    verbose_name = 'Models'

    def ready(self):
        from . import user, call, evaluation  # noqa
        from . import signals  # noqa 