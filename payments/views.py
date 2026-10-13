from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Payment.objects.filter(
            student__room__hostel__owner=self.request.user
        ).select_related(
            'student',
            'student__room',
            'student__room__hostel'
        ).order_by('-payment_date')

    def perform_create(self, serializer):

        serializer.save()


class PaymentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Payment.objects.filter(
            student__room__hostel__owner=self.request.user
        )