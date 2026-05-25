from rest_framework import serializers
from .models import Gallery


class GallerySerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = Gallery
        fields = "__all__"

    def get_file(self, obj):
        try:
            return obj.file.url
        except:
            return ""