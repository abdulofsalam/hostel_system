from django.contrib import admin
from .models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'room_number',
        'hostel',
        'capacity',
        'occupied',
        'available_beds',
        'monthly_rent',
    )

    search_fields = (
        'room_number',
        'hostel__name',
    )

    list_filter = (
        'hostel',
    )