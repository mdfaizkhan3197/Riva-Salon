from django.urls import path
from .views import UploadGalleryView, GalleryListView, DeleteGalleryView

urlpatterns = [
    path('', GalleryListView.as_view()),
    path('upload/', UploadGalleryView.as_view()),
    path('<int:pk>/', DeleteGalleryView.as_view()),
]