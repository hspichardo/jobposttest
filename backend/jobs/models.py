# Generated with AI assistance - JobPost and Application models
from django.db import models
from django.conf import settings


class JobPost(models.Model):
    """
    Model for job postings
    """
    CATEGORY_CHOICES = [
        ('technology', 'Tecnología'),
        ('marketing', 'Marketing'),
        ('sales', 'Ventas'),
        ('design', 'Diseño'),
        ('finance', 'Finanzas'),
        ('human_resources', 'Recursos Humanos'),
        ('customer_service', 'Atención al Cliente'),
        ('operations', 'Operaciones'),
        ('other', 'Otro'),
    ]
    
    title = models.CharField(
        max_length=200,
        help_text='Job title'
    )
    
    description = models.TextField(
        help_text='Detailed job description'
    )
    
    location = models.CharField(
        max_length=100,
        help_text='Job location'
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='other',
        help_text='Job category'
    )
    
    salary_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Minimum salary'
    )
    
    salary_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Maximum salary'
    )
    
    requirements = models.TextField(
        blank=True,
        help_text='Job requirements and qualifications'
    )
    
    benefits = models.TextField(
        blank=True,
        help_text='Job benefits and perks'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether the job posting is active'
    )
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_jobs',
        help_text='Admin who created this job posting'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Job Post'
        verbose_name_plural = 'Job Posts'
    
    def __str__(self):
        return f"{self.title} - {self.location}"
    
    @property
    def applications_count(self):
        return self.applications.count()


class Application(models.Model):
    """
    Model for job applications
    """
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('reviewing', 'En Revisión'),
        ('interviewed', 'Entrevistado'),
        ('accepted', 'Aceptado'),
        ('rejected', 'Rechazado'),
    ]
    
    job_post = models.ForeignKey(
        JobPost,
        on_delete=models.CASCADE,
        related_name='applications',
        help_text='Job post being applied to'
    )
    
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
        help_text='User applying for the job'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text='Application status'
    )
    
    cover_letter = models.TextField(
        blank=True,
        help_text='Cover letter from applicant'
    )
    
    resume_url = models.URLField(
        blank=True,
        help_text='URL to resume/CV'
    )
    
    notes = models.TextField(
        blank=True,
        help_text='Internal notes from admin'
    )
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-submitted_at']
        unique_together = ['job_post', 'applicant']
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
    
    def __str__(self):
        return f"{self.applicant.username} - {self.job_post.title} ({self.get_status_display()})" 