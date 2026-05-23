from rest_framework import serializers
from .models import Service
from reviews.models import Review
from django.db.models import Avg


class ServiceSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = "__all__"

    def get_avg_rating(self, obj):
        avg = Review.objects.filter(service=obj).aggregate(Avg("rating"))["rating__avg"]
        return round(avg, 1) if avg else 0

    def get_total_reviews(self, obj):
        return Review.objects.filter(service=obj).count()