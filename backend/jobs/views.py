# Generated with AI assistance - Views for JobPost and Application with role-based permissions
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from .models import JobPost, Application
from .serializers import (
    JobPostSerializer,
    JobPostCreateUpdateSerializer,
    JobPostListSerializer,
    JobPostStatusUpdateSerializer,
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationUpdateSerializer,
    ApplicationListSerializer,
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrAdmin


@extend_schema_view(
    get=extend_schema(
        summary="Listar trabajos públicos",
        description="Obtiene una lista paginada de todas las ofertas de trabajo activas disponibles públicamente",
        tags=["Trabajos"],
        parameters=[
            OpenApiParameter(
                name='category',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por categoría de trabajo'
            ),
            OpenApiParameter(
                name='location',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por ubicación'
            ),
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Buscar en título, descripción y ubicación'
            ),
        ]
    )
)
class JobPostListView(generics.ListAPIView):
    """
    API view for listing job posts (public access)
    """
    queryset = JobPost.objects.filter(is_active=True)
    serializer_class = JobPostListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'location']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']


@extend_schema(
    summary="Detalle de trabajo",
    description="Obtiene los detalles completos de una oferta de trabajo específica",
    tags=["Trabajos"]
)
class JobPostDetailView(generics.RetrieveAPIView):
    """
    API view for job post detail (public access)
    """
    queryset = JobPost.objects.filter(is_active=True)
    serializer_class = JobPostSerializer
    permission_classes = [AllowAny]

class JobAdminPostDetailView(generics.RetrieveAPIView):
    """
    API view for job post detail (public access)
    """
    queryset = JobPost.objects.filter()
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]


@extend_schema(
    summary="Crear trabajo",
    description="Crea una nueva oferta de trabajo (solo administradores)",
    tags=["Admin", "Trabajos"]
)
class JobPostCreateView(generics.CreateAPIView):
    """
    API view for creating job posts (admin only)
    """
    queryset = JobPost.objects.all()
    serializer_class = JobPostCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Only admins can create job posts
        if not self.request.user.is_admin:
            raise permissions.PermissionDenied("Solo los administradores pueden crear ofertas de trabajo")
        serializer.save(created_by=self.request.user)


class JobPostUpdateView(generics.UpdateAPIView):
    """
    API view for updating job posts (admin only)
    """
    queryset = JobPost.objects.all()
    serializer_class = JobPostCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        # Only admins or the creator can update
        if not (self.request.user.is_admin or obj.created_by == self.request.user):
            raise permissions.PermissionDenied("No tienes permisos para editar esta oferta")
        return obj
    
    def patch(self, request, *args, **kwargs):
        """
        Handle partial updates
        """
        return self.partial_update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        """
        Override to handle partial updates properly
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class JobPostDeleteView(generics.DestroyAPIView):
    """
    API view for deleting job posts (admin only)
    """
    queryset = JobPost.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        # Only admins or the creator can delete
        if not (self.request.user.is_admin or obj.created_by == self.request.user):
            raise permissions.PermissionDenied("No tienes permisos para eliminar esta oferta")
        return obj


class AdminJobPostListView(generics.ListAPIView):
    """
    API view for admin to list all job posts
    """
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'location', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # Only admins can see all job posts
        if not self.request.user.is_admin:
            raise permissions.PermissionDenied("Solo los administradores pueden ver todas las ofertas")
        return super().get_queryset()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_job(request, job_id):
    """
    API view for applying to a job (applicants only)
    """
    if request.user.is_admin:
        return Response({
            'error': 'Los administradores no pueden aplicar a trabajos'
        }, status=status.HTTP_403_FORBIDDEN)
    
    job_post = get_object_or_404(JobPost, id=job_id, is_active=True)
    
    # Check if user already applied
    if Application.objects.filter(job_post=job_post, applicant=request.user).exists():
        return Response({
            'error': 'Ya has aplicado a esta oferta de trabajo'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = ApplicationCreateSerializer(
        data=request.data,
        context={'request': request, 'job_post': job_post}
    )
    
    if serializer.is_valid():
        application = serializer.save()
        response_serializer = ApplicationSerializer(application)
        return Response({
            'message': 'Aplicación enviada exitosamente',
            'application': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationListView(generics.ListAPIView):
    """
    API view for listing applications
    """
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'job_post']
    ordering_fields = ['submitted_at']
    ordering = ['-submitted_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            # Admins can see all applications
            return Application.objects.all()
        else:
            # Applicants can only see their own applications
            return Application.objects.filter(applicant=user)


class ApplicationDetailView(generics.RetrieveAPIView):
    """
    API view for application detail
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Application.objects.all()
        else:
            return Application.objects.filter(applicant=user)


class ApplicationUpdateView(generics.UpdateAPIView):
    """
    API view for updating application status (admin only)
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        # Only admins can update application status
        if not self.request.user.is_admin:
            raise permissions.PermissionDenied("Solo los administradores pueden actualizar el estado de las aplicaciones")
        return obj


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    """
    API view to get current user's applications
    """
    if request.user.is_admin:
        return Response({
            'error': 'Los administradores no tienen aplicaciones'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    applications = Application.objects.filter(applicant=request.user)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_applications(request, job_id):
    """
    API view to get applications for a specific job (admin only)
    """
    if not request.user.is_admin:
        return Response({
            'error': 'Solo los administradores pueden ver las aplicaciones'
        }, status=status.HTTP_403_FORBIDDEN)
    
    job_post = get_object_or_404(JobPost, id=job_id)
    applications = Application.objects.filter(job_post=job_post)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_job_status(request, pk):
    """
    API view for toggling job post status (admin only)
    """
    if not request.user.is_admin:
        return Response({
            'error': 'Solo los administradores pueden cambiar el estado de las ofertas'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        job_post = JobPost.objects.get(pk=pk)
    except JobPost.DoesNotExist:
        return Response({
            'error': 'Oferta de trabajo no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Only admins or the creator can update
    if not (request.user.is_admin or job_post.created_by == request.user):
        return Response({
            'error': 'No tienes permisos para editar esta oferta'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = JobPostStatusUpdateSerializer(
        job_post, 
        data=request.data, 
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Estado actualizado exitosamente',
            'is_active': serializer.data['is_active']
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 