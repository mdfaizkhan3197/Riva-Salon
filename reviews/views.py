from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from .models import Review
from .serializers import ReviewSerializer
from services.models import Service

# ✅ FIXED IMPORT (IMPORTANT)
from booking.models import Booking   # 👈 FIX THIS based on your app name


class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        service_id = request.data.get("service")
        rating = request.data.get("rating")
        comment = request.data.get("comment")

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=404)

        # prevent duplicate review per user per service
        if Review.objects.filter(user=request.user, service=service).exists():
            return Response({"error": "Already reviewed this service"}, status=400)

        review = Review.objects.create(
            user=request.user,
            service=service,
            rating=rating,
            comment=comment
        )

        return Response(ReviewSerializer(review).data, status=201)
    
class ListReviewView(ListAPIView):
    queryset = Review.objects.all().order_by("-created_at")
    serializer_class = ReviewSerializer