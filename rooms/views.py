from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Room
from .serializers import RoomSerializer


class RoomListCreateView(generics.ListCreateAPIView):

    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Room.objects.filter(
            hostel__owner=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save()


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Room.objects.filter(
            hostel__owner=self.request.user
        )