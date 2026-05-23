from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Gallery
from .serializers import GallerySerializer

class UploadGalleryView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = GallerySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class GalleryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = Gallery.objects.all().order_by('-created_at')
        serializer = GallerySerializer(data, many=True)
        return Response(serializer.data)
    
class DeleteGalleryView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            item = Gallery.objects.get(pk=pk)
            item.delete()
            return Response({"message": "Deleted successfully"})
        except Gallery.DoesNotExist:
            return Response({"error": "Not found"}, status=404)