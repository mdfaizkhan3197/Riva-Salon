from rest_framework import serializers
from .models import Gallery


class GallerySerializer(serializers.ModelSerializer):

    class Meta:
        model = Gallery
        fields = [
            "id",
            "title",
            "media_type",
            "file",
            "created_at",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        try:
            representation["file"] = instance.file.url
        except:
            representation["file"] = ""

        return representation