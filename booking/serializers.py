from rest_framework import serializers
from .models import Booking
from services.models import Service


class ServiceMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name","price"]


class BookingSerializer(serializers.ModelSerializer):
    services = ServiceMiniSerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"