from django.urls import path
from .views import (
    CreateBookingView,
    AllBookingsView,
    UpdateBookingStatusView,
    MyBookingsView  
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('create/', CreateBookingView.as_view()),
    path('all/', AllBookingsView.as_view()),
    path('update/<int:pk>/', UpdateBookingStatusView.as_view()),
    path('my/', MyBookingsView.as_view()), 
    path('token/refresh/', TokenRefreshView.as_view()), 
]