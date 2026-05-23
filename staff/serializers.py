from rest_framework import serializers
from .models import Staff, Attendance

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source="staff.name", read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "staff", "staff_name", "status", "date"]