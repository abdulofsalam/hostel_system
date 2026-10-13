from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Student
from .serializers import StudentSerializer


class StudentListCreateView(generics.ListCreateAPIView):

    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Student.objects.filter(
            room__hostel__owner=self.request.user
        ).select_related(
            'room',
            'room__hostel'
        ).order_by('-created_at')

    def perform_create(self, serializer):

        serializer.save()


class StudentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Student.objects.filter(
            room__hostel__owner=self.request.user
        )