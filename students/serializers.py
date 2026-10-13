from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):

    hostel_name = serializers.CharField(
        source='room.hostel.name',
        read_only=True
    )

    room_number = serializers.CharField(
        source='room.room_number',
        read_only=True
    )

    class Meta:
        model = Student

        fields = [
            'id',
            'room',
            'hostel_name',
            'room_number',
            'full_name',
            'cnic',
            'phone',
            'email',
            'guardian_name',
            'guardian_phone',
            'address',
            'admission_date',
            'monthly_rent',
            'is_active',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'hostel_name',
            'room_number',
            'created_at',
            'updated_at',
        ]

    def validate(self, data):

        request = self.context['request']
        user = request.user

        room = data.get('room')

        # Check ownership
        if room and room.hostel.owner != user:
            raise serializers.ValidationError({
                'room':
                'You cannot assign a student to another owner\'s room.'
            })

        if room:

            # Count active students
            occupied = room.students.filter(
                is_active=True
            ).count()

            # During UPDATE
            if self.instance:

                # If the student is already active in this room,
                # don't count that student again.
                if (
                    self.instance.room_id == room.id
                    and self.instance.is_active
                ):
                    occupied -= 1

            if occupied >= room.capacity:

                raise serializers.ValidationError({
                    'room':
                    f'Room {room.room_number} is full. '
                    f'Capacity: {room.capacity}.'
                })

        return data