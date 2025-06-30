#!/usr/bin/env python
"""
Script para crear datos de ejemplo en la base de datos
Ejecutar: python manage.py shell < create_sample_data.py
"""

from users.models import User
from jobs.models import JobPost, Application
from django.utils import timezone
from decimal import Decimal

# Crear usuarios de prueba
print("Creando usuarios de prueba...")

# Admin usuario
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@jobportal.com',
        'first_name': 'Admin',
        'last_name': 'Principal',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print("✓ Usuario admin creado")

# Usuarios aplicantes
applicants_data = [
    {
        'username': 'juan.perez',
        'email': 'juan.perez@email.com',
        'first_name': 'Juan',
        'last_name': 'Pérez',
        'phone': '+1234567890'
    },
    {
        'username': 'maria.garcia',
        'email': 'maria.garcia@email.com',
        'first_name': 'María',
        'last_name': 'García',
        'phone': '+1234567891'
    },
    {
        'username': 'carlos.rodriguez',
        'email': 'carlos.rodriguez@email.com',
        'first_name': 'Carlos',
        'last_name': 'Rodríguez',
        'phone': '+1234567892'
    }
]

applicant_users = []
for data in applicants_data:
    user, created = User.objects.get_or_create(
        username=data['username'],
        defaults={
            **data,
            'role': 'applicant'
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        print(f"✓ Usuario aplicante {user.username} creado")
    applicant_users.append(user)

# Crear trabajos de ejemplo
print("\nCreando trabajos de ejemplo...")

jobs_data = [
    {
        'title': 'Desarrollador Full Stack',
        'description': 'Buscamos un desarrollador full stack con experiencia en React y Django. Trabajarás en proyectos emocionantes con un equipo dinámico.',
        'location': 'Madrid, España',
        'category': 'technology',
        'salary_min': Decimal('40000'),
        'salary_max': Decimal('60000'),
        'requirements': 'Experiencia en React, Django, PostgreSQL. Conocimientos de Docker y AWS son un plus.',
        'benefits': 'Seguro médico, trabajo remoto flexible, bonos por rendimiento.'
    },
    {
        'title': 'Especialista en Marketing Digital',
        'description': 'Únete a nuestro equipo de marketing para desarrollar estrategias digitales innovadoras y gestionar campañas publicitarias.',
        'location': 'Barcelona, España',
        'category': 'marketing',
        'salary_min': Decimal('35000'),
        'salary_max': Decimal('50000'),
        'requirements': 'Experiencia en Google Ads, Facebook Ads, SEO/SEM. Conocimientos de Analytics.',
        'benefits': 'Formación continua, ambiente de trabajo creativo, días adicionales de vacaciones.'
    },
    {
        'title': 'Diseñador UX/UI',
        'description': 'Buscamos un diseñador creativo para crear experiencias de usuario excepcionales en nuestras aplicaciones web y móviles.',
        'location': 'Valencia, España',
        'category': 'design',
        'salary_min': Decimal('38000'),
        'salary_max': Decimal('55000'),
        'requirements': 'Dominio de Figma, Adobe Creative Suite, principios de UX. Portfolio requerido.',
        'benefits': 'Equipo de última generación, horarios flexibles, presupuesto para conferencias.'
    },
    {
        'title': 'Gerente de Ventas',
        'description': 'Oportunidad para liderar nuestro equipo de ventas y desarrollar nuevos mercados. Experiencia en B2B requerida.',
        'location': 'Sevilla, España',
        'category': 'sales',
        'salary_min': Decimal('45000'),
        'salary_max': Decimal('70000'),
        'requirements': 'Experiencia en ventas B2B, liderazgo de equipos, CRM. Inglés fluido.',
        'benefits': 'Comisiones atractivas, coche de empresa, plan de carrera definido.'
    },
    {
        'title': 'Analista Financiero',
        'description': 'Únete a nuestro departamento financiero para analizar datos, crear reportes y apoyar en la toma de decisiones estratégicas.',
        'location': 'Bilbao, España',
        'category': 'finance',
        'salary_min': Decimal('42000'),
        'salary_max': Decimal('58000'),
        'requirements': 'Título en Finanzas/Economía, Excel avanzado, conocimientos de SQL. CFA es un plus.',
        'benefits': 'Seguro médico premium, plan de pensiones, formación en certificaciones.'
    },
    {
        'title': 'Especialista en Recursos Humanos',
        'description': 'Buscamos un profesional de RRHH para gestionar el talento, reclutamiento y desarrollo organizacional.',
        'location': 'Zaragoza, España',
        'category': 'human_resources',
        'salary_min': Decimal('36000'),
        'salary_max': Decimal('48000'),
        'requirements': 'Experiencia en reclutamiento, gestión de personal, conocimientos laborales.',
        'benefits': 'Ambiente colaborativo, desarrollo profesional, trabajo híbrido.'
    }
]

created_jobs = []
for job_data in jobs_data:
    job, created = JobPost.objects.get_or_create(
        title=job_data['title'],
        defaults={
            **job_data,
            'created_by': admin_user
        }
    )
    if created:
        print(f"✓ Trabajo '{job.title}' creado")
    created_jobs.append(job)

# Crear algunas aplicaciones de ejemplo
print("\nCreando aplicaciones de ejemplo...")

applications_data = [
    {
        'job': created_jobs[0],  # Desarrollador Full Stack
        'applicant': applicant_users[0],  # Juan Pérez
        'status': 'reviewing',
        'cover_letter': 'Estimados, estoy muy interesado en la posición de Desarrollador Full Stack. Tengo 3 años de experiencia trabajando con React y Django...',
        'resume_url': 'https://example.com/resume/juan_perez.pdf'
    },
    {
        'job': created_jobs[0],  # Desarrollador Full Stack
        'applicant': applicant_users[1],  # María García
        'status': 'pending',
        'cover_letter': 'Hola, soy María García y me gustaría aplicar para el puesto de desarrolladora. Mi experiencia incluye...',
        'resume_url': 'https://example.com/resume/maria_garcia.pdf'
    },
    {
        'job': created_jobs[1],  # Marketing Digital
        'applicant': applicant_users[1],  # María García
        'status': 'interviewed',
        'cover_letter': 'Me emociona la oportunidad de unirme al equipo de marketing. Tengo experiencia gestionando campañas...',
        'resume_url': 'https://example.com/resume/maria_garcia.pdf'
    },
    {
        'job': created_jobs[2],  # Diseñador UX/UI
        'applicant': applicant_users[2],  # Carlos Rodríguez
        'status': 'accepted',
        'cover_letter': 'Como diseñador UX/UI con 4 años de experiencia, estoy emocionado por contribuir a sus proyectos...',
        'resume_url': 'https://example.com/resume/carlos_rodriguez.pdf'
    }
]

for app_data in applications_data:
    application, created = Application.objects.get_or_create(
        job_post=app_data['job'],
        applicant=app_data['applicant'],
        defaults={
            'status': app_data['status'],
            'cover_letter': app_data['cover_letter'],
            'resume_url': app_data['resume_url']
        }
    )
    if created:
        print(f"✓ Aplicación de {application.applicant.first_name} para {application.job_post.title} creada")

print("\n🎉 Datos de ejemplo creados exitosamente!")
print("\nCredenciales de acceso:")
print("Admin: admin / admin123")
print("Aplicantes: juan.perez / password123, maria.garcia / password123, carlos.rodriguez / password123") 