from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Inventory
from . serializers import InventorySerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status


class InventoryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        items =Inventory.objects.all()
        serializer = InventorySerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = InventorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
class InventoryDetailView(APIView):
    permission_classes=[IsAdminUser]

    def put(self,request,pk):
        item = Inventory.objects.get(pk=pk)
        serializer = InventorySerializer(item,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    def delete(self,request,pk):
        item = get_object_or_404(Inventory,pk=pk)
        item.delete()
        return Response({"message":"Deleted"})


    def delete(self, request, pk):
            item = get_object_or_404(Inventory, pk=pk)
            item.delete()
            return Response({"message": "Deleted successfully"})  