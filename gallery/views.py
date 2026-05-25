from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAdminUser,
    AllowAny,
)
from rest_framework import status

from .models import Gallery
from .serializers import GallerySerializer


class UploadGalleryView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            gallery = Gallery.objects.create(
                title=request.data.get("title"),
                media_type=request.data.get("media_type"),
                file=file
            )

            serializer = GallerySerializer(
                gallery,
                context={"request": request}
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class GalleryListView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        gallery = Gallery.objects.all().order_by(
            "-created_at"
        )

        serializer = GallerySerializer(
            gallery,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class DeleteGalleryView(APIView):

    permission_classes = [IsAdminUser]

    def delete(self, request, pk):

        try:

            item = Gallery.objects.get(pk=pk)

            item.delete()

            return Response(
                {"message": "Deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Gallery.DoesNotExist:

            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )