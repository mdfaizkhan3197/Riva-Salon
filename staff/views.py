from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404

from .models import Staff, Attendance
from .serializers import StaffSerializer, AttendanceSerializer
from datetime import datetime, date


# ================= STAFF =================
class StaffView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = Staff.objects.all()
        return Response(StaffSerializer(data, many=True).data)

    def post(self, request):
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class StaffDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        staff = get_object_or_404(Staff, pk=pk)
        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    def delete(self, request, pk):
        staff = get_object_or_404(Staff, pk=pk)
        staff.delete()
        return Response({"message": "Deleted"})


# ================= ATTENDANCE =================
class AttendanceView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = Attendance.objects.all().order_by("-date")
        return Response(AttendanceSerializer(data, many=True).data)
    
    def post(self, request):
     staff_id = request.data.get("staff")
     selected_date = request.data.get("date")
     status_value = request.data.get("status")

    # ✅ Validation
     if not staff_id or not selected_date or not status_value:
        return Response(
            {"error": "Staff, date and status are required"},
            status=400
        )

    # ✅ Convert date
     try:
         selected_date_obj = datetime.strptime(
            selected_date, "%Y-%m-%d"
        ).date()
     except ValueError:
        return Response(
            {"error": "Invalid date format"},
            status=400
        )

    # ❌ ONLY block future (past is allowed)
     if selected_date_obj > date.today():
        return Response(
            {"error": "Future date not allowed"},
            status=400
        )

    # ⚠️ Duplicate check (IMPORTANT)
     existing = Attendance.objects.filter(
        staff_id=staff_id,
        date=selected_date_obj
    ).first()

     if existing:
        # 👉 Instead of blocking, UPDATE it
        existing.status = status_value
        existing.save()
        return Response({"message": "Attendance updated"})

     serializer = AttendanceSerializer(data={
        "staff": staff_id,
        "status": status_value,
        "date": selected_date_obj
    })

     if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

     return Response(serializer.errors)
    
    def delete(self, request, pk):
        try:
            attendance = Attendance.objects.get(pk=pk)
            attendance.delete()
            return Response({"message": "Deleted successfully"})
        except Attendance.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
    