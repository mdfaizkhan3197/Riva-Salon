from django.urls import path
from .views import CreateReviewView, ListReviewView

urlpatterns = [
    path("create/", CreateReviewView.as_view()),
    path("", ListReviewView.as_view()),
]