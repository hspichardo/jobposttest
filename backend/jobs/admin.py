# Generated with AI assistance - Django admin configuration for JobPost and Application models
from django.contrib import admin
from .models import JobPost, Application


@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    """
    Admin configuration for JobPost model
    """
    list_display = (
        'title', 'location', 'category', 'is_active', 
        'created_by', 'applications_count', 'created_at'
    )
    list_filter = ('category', 'location', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'location')
    ordering = ('-created_at',)
    readonly_fields = ('applications_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'description', 'location', 'category')
        }),
        ('Detalles del Trabajo', {
            'fields': ('salary_min', 'salary_max', 'requirements', 'benefits')
        }),
        ('Estado y Administración', {
            'fields': ('is_active', 'created_by')
        }),
        ('Información del Sistema', {
            'fields': ('applications_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by when creating
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    """
    Admin configuration for Application model
    """
    list_display = (
        'applicant', 'job_post', 'status', 'submitted_at'
    )
    list_filter = ('status', 'submitted_at', 'job_post__category')
    search_fields = (
        'applicant__username', 'applicant__email', 
        'job_post__title', 'cover_letter'
    )
    ordering = ('-submitted_at',)
    readonly_fields = ('submitted_at', 'updated_at')
    
    fieldsets = (
        ('Información de la Aplicación', {
            'fields': ('job_post', 'applicant', 'status')
        }),
        ('Documentos del Aplicante', {
            'fields': ('cover_letter', 'resume_url')
        }),
        ('Notas Administrativas', {
            'fields': ('notes',)
        }),
        ('Fechas', {
            'fields': ('submitted_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_reviewing', 'mark_as_interviewed', 'mark_as_accepted', 'mark_as_rejected']
    
    def mark_as_reviewing(self, request, queryset):
        updated = queryset.update(status='reviewing')
        self.message_user(request, f'{updated} aplicaciones marcadas como "En Revisión".')
    mark_as_reviewing.short_description = 'Marcar como "En Revisión"'
    
    def mark_as_interviewed(self, request, queryset):
        updated = queryset.update(status='interviewed')
        self.message_user(request, f'{updated} aplicaciones marcadas como "Entrevistado".')
    mark_as_interviewed.short_description = 'Marcar como "Entrevistado"'
    
    def mark_as_accepted(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(request, f'{updated} aplicaciones marcadas como "Aceptado".')
    mark_as_accepted.short_description = 'Marcar como "Aceptado"'
    
    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} aplicaciones marcadas como "Rechazado".')
    mark_as_rejected.short_description = 'Marcar como "Rechazado"' 