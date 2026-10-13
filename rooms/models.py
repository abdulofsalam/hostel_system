from django.db import models
from hostels.models import Hostel


class Room(models.Model):
    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE,
        related_name='rooms'
    )

    room_number = models.CharField(max_length=50)
    floor = models.CharField(max_length=50, blank=True)

    capacity = models.PositiveIntegerField(default=1)

    monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def occupied(self):
        return self.students.filter(
            is_active=True
        ).count()

    @property
    def available_beds(self):
        return self.capacity - self.occupied

    def __str__(self):
        return f"{self.hostel.name} - Room {self.room_number}"