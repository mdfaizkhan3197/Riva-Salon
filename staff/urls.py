from django.urls import path
from .views import StaffView, StaffDetailView, AttendanceView

urlpatterns = [
    path("staff/", StaffView.as_view()),
    path("staff/<int:pk>/", StaffDetailView.as_view()),
    path("attendance/", AttendanceView.as_view()),
    path("attendance/<int:pk>/",AttendanceView.as_view()),
]