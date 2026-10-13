from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):

    occupied = serializers.ReadOnlyField()
    available_beds = serializers.ReadOnlyField()

    class Meta:
        model = Room

        fields = [
            'id',
            'hostel',
            'room_number',
            'floor',
            'capacity',
            'occupied',
            'available_beds',
            'monthly_rent',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'occupied',
            'available_beds',
            'created_at',
            'updated_at',
        ]

    def validate(self, data):

        request = self.context['request']
        user = request.user

        hostel = data.get('hostel')

        if hostel and hostel.owner != user:
            raise serializers.ValidationError({
                'hostel':
                'You cannot use another owner\'s hostel.'
            })

        capacity = data.get(
            'capacity',
            self.instance.capacity
            if self.instance else 1
        )

        if self.instance:
            occupied = self.instance.occupied

            if capacity < occupied:
                raise serializers.ValidationError({
                    'capacity':
                    f'Capacity cannot be less than '
                    f'current occupancy ({occupied}).'
                })

        return data