from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer
from services.models import Service


class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        service_ids = request.data.get("services")
        booking_date = request.data.get("booking_date")
        booking_time = request.data.get("booking_time")

        if not service_ids:
            return Response({"error": "Services required"}, status=400)

        if not booking_date or not booking_time:
            return Response({"error": "Date and time required"}, status=400)

        services = Service.objects.filter(id__in=service_ids)

        if not services.exists():
            return Response({"error": "Invalid services"}, status=400)

        total = sum(s.price for s in services)

        booking = Booking.objects.create(
            user=request.user,
            date=booking_date,
            time=booking_time,
            total_amount=total,
            status="pending"
        )

        booking.services.set(services)

        return Response(
            {
                "message": "Booking created",
                "total_amount": total,
                "booking_id": booking.id
            },
            status=201
        )


class AllBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "only admin"}, status=403)

        bookings = Booking.objects.all().order_by("-id")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class UpdateBookingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not request.user.is_staff:
            return Response({"error": "only admin"}, status=403)

        try:
            booking = Booking.objects.get(id=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        status_value = request.data.get("status")

        if status_value not in ["pending", "approved", "completed", "cancelled"]:
            return Response({"error": "Invalid status"}, status=400)

        booking.status = status_value
        booking.save()

        return Response({"message": "status updated"})



class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by("-id")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class RateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(id=pk, user=request.user)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        # ONLY COMPLETED BOOKINGS
        if booking.status != "completed":
            return Response(
                {"error": "You can rate only completed services"},
                status=403
            )

        rating = request.data.get("rating")
        review = request.data.get("review")

        if not rating:
            return Response({"error": "Rating required"}, status=400)

        booking.rating = rating
        booking.review = review

        booking.save()

        return Response({"message": "Rating submitted successfully"})