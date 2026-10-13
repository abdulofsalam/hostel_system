from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source='student.full_name',
        read_only=True
    )

    room_number = serializers.CharField(
        source='student.room.room_number',
        read_only=True
    )

    hostel_name = serializers.CharField(
        source='student.room.hostel.name',
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            'id',
            'student',
            'student_name',
            'room_number',
            'hostel_name',
            'amount',
            'payment_date',
            'payment_for_month',
            'payment_method',
            'status',
            'transaction_id',
            'notes',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'student_name',
            'room_number',
            'hostel_name',
            'created_at',
            'updated_at',
        ]

    def validate(self, data):

        request = self.context['request']
        user = request.user

        student = data.get('student')

        if student:

            if student.room is None:
                raise serializers.ValidationError({
                    'student':
                    'This student is not assigned to a room.'
                })

            if student.room.hostel.owner != user:
                raise serializers.ValidationError({
                    'student':
                    'You cannot create a payment for another owner\'s student.'
                })

        return data