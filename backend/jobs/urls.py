# Generated with AI assistance - URL patterns for jobs app endpoints
from django.urls import path
from . import views

urlpatterns = [
    # Public job endpoints
    path('jobs/', views.JobPostListView.as_view(), name='job_list'),
    path('admin/jobs/<int:pk>/', views.JobPostDetailView.as_view(), name='job_detail'),
    
    # Admin job management endpoints
    path('admin/jobs/', views.AdminJobPostListView.as_view(), name='admin_job_list'),
    path('admin/jobs/create/', views.JobPostCreateView.as_view(), name='job_create'),
    path('admin/jobs/<int:pk>/update/', views.JobPostUpdateView.as_view(), name='job_update'),
    path('admin/jobs/<int:pk>/delete/', views.JobPostDeleteView.as_view(), name='job_delete'),
    path('admin/jobs/<int:job_id>/applications/', views.job_applications, name='job_applications'),
    
    # Application endpoints
    path('jobs/<int:job_id>/apply/', views.apply_to_job, name='apply_to_job'),
    path('applications/', views.ApplicationListView.as_view(), name='application_list'),
    path('applications/<int:pk>/', views.ApplicationDetailView.as_view(), name='application_detail'),
    path('applications/<int:pk>/update/', views.ApplicationUpdateView.as_view(), name='application_update'),
    path('my-applications/', views.my_applications, name='my_applications'),
] 