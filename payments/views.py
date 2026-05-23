from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from booking.models import Booking


class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking')
        method = request.data.get('payment_method')

        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        # Prevent duplicate payment
        if Payment.objects.filter(booking=booking).exists():
            return Response({"error": "Payment already exists"}, status=400)

        payment = Payment.objects.create(
            user=request.user,
            booking=booking,
            amount=booking.total_amount,
            payment_method=method,
            status='paid' if method == 'cash' else 'pending'
        )

        return Response({
            "message": "Payment created",
            "status": payment.status
        })