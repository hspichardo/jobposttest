# Generated with AI assistance - JobPost and Application serializers
from rest_framework import serializers
from .models import JobPost, Application
from users.serializers import UserSerializer


class JobPostSerializer(serializers.ModelSerializer):
    """
    Serializer for JobPost model
    """
    created_by = UserSerializer(read_only=True)
    applications_count = serializers.ReadOnlyField()
    
    class Meta:
        model = JobPost
        fields = [
            'id', 'title', 'description', 'location', 'category',
            'salary_min', 'salary_max', 'requirements', 'benefits',
            'is_active', 'created_by', 'applications_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class JobPostCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating JobPost (admin only)
    """
    class Meta:
        model = JobPost
        fields = [
            'title', 'description', 'location', 'category',
            'salary_min', 'salary_max', 'requirements', 'benefits', 'is_active'
        ]
    
    def validate_salary_min(self, value):
        if value and value < 0:
            raise serializers.ValidationError("El salario mínimo no puede ser negativo")
        return value
    
    def validate_salary_max(self, value):
        if value and value < 0:
            raise serializers.ValidationError("El salario máximo no puede ser negativo")
        return value
    
    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError(
                "El salario mínimo no puede ser mayor que el salario máximo"
            )
        
        return attrs


class JobPostListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for job listing (public view)
    """
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    applications_count = serializers.ReadOnlyField()
    
    class Meta:
        model = JobPost
        fields = [
            'id', 'title', 'description', 'location', 'category',
            'salary_min', 'salary_max', 'created_by_name',
            'applications_count', 'created_at'
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for Application model
    """
    applicant = UserSerializer(read_only=True)
    job_post = JobPostSerializer(read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'job_post', 'applicant', 'status', 'cover_letter',
            'resume_url', 'notes', 'submitted_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applicant', 'submitted_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating job applications
    """
    class Meta:
        model = Application
        fields = ['cover_letter', 'resume_url']
    
    def validate_resume_url(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Debe ser una URL válida")
        return value
    
    def create(self, validated_data):
        # Set the applicant and job_post from context
        validated_data['applicant'] = self.context['request'].user
        validated_data['job_post'] = self.context['job_post']
        return super().create(validated_data)


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating application status (admin only)
    """
    class Meta:
        model = Application
        fields = ['status', 'notes']


class ApplicationListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for application listing
    """
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    job_title = serializers.CharField(source='job_post.title', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'job_title', 'applicant_name', 'applicant_email',
            'status', 'submitted_at'
        ] 