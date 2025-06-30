# Generated with AI assistance - Custom permissions for role-based access control
from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to create/edit/delete objects.
    Read-only permissions are allowed for any request.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed for admin users
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner or admin
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user or request.user.is_admin
        elif hasattr(obj, 'applicant'):
            return obj.applicant == request.user or request.user.is_admin
        
        return request.user.is_admin


class IsApplicantOrAdmin(permissions.BasePermission):
    """
    Custom permission for application-related operations.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.is_admin:
            return True
        
        # Applicants can only access their own applications
        return obj.applicant == request.user 