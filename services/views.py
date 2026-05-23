from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import status
from rest_framework.response import Response

from .models import Service
from .serializers import ServiceSerializer


# ✅ Custom Permission
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # ✅ Everyone can READ
        if request.method in SAFE_METHODS:
            return True

        # ✅ Only admin can WRITE
        return request.user and request.user.is_staff


# ✅ Main ViewSet
class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]

    # Optional: custom message
    def create(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"error": "Only admin can add services"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)