# Generated with AI assistance - Custom User model with role-based authentication
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with role-based authentication
    """
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('applicant', 'Applicant'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='applicant',
        help_text='User role for permission management'
    )
    
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text='Phone number'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_applicant(self):
        return self.role == 'applicant' 