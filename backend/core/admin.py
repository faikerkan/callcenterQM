from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Call, Evaluation, EvaluationCriteria

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Özelleştirilmiş kullanıcı admin paneli
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'team', 'employee_id', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active', 'team')
    fieldsets = UserAdmin.fieldsets + (
        ('Ek Bilgiler', {'fields': ('role', 'team', 'employee_id')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Ek Bilgiler', {'fields': ('role', 'team', 'employee_id')}),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name', 'employee_id')
    ordering = ('username',)

@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    """
    Çağrı admin paneli
    """
    list_display = ('agent', 'call_date', 'phone_number', 'duration', 'queue', 'status')
    list_filter = ('status', 'queue', 'call_date')
    search_fields = ('agent__username', 'agent__first_name', 'agent__last_name', 'phone_number')
    date_hierarchy = 'call_date'
    readonly_fields = ('created_at', 'updated_at')

@admin.register(EvaluationCriteria)
class EvaluationCriteriaAdmin(admin.ModelAdmin):
    """
    Değerlendirme kriteri admin paneli
    """
    list_display = ('name', 'weight')
    search_fields = ('name', 'description')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    """
    Değerlendirme admin paneli
    """
    list_display = ('call', 'evaluator', 'total_score', 'created_at')
    list_filter = ('created_at', 'total_score')
    search_fields = ('call__agent__username', 'evaluator__username', 'comments')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at' 