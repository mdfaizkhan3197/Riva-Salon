from django.db import models


class Gallery(models.Model):

    MEDIA_TYPE = (
        ("image", "Image"),
        ("video", "Video"),
    )

    title = models.CharField(
        max_length=100
    )

    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPE,
        default="image"
    )

    file = models.FileField(
        upload_to="gallery/",
        blank=False,
        null=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title