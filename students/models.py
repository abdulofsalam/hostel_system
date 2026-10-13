from django.db import models
from rooms.models import Room


class Student(models.Model):

    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )

    full_name = models.CharField(max_length=200)

    cnic = models.CharField(
        max_length=20,
        unique=True
    )

    phone = models.CharField(max_length=20)

    email = models.EmailField(
        blank=True
    )

    guardian_name = models.CharField(
        max_length=200
    )

    guardian_phone = models.CharField(
        max_length=20
    )

    address = models.TextField(
        blank=True
    )

    admission_date = models.DateField()

    monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.full_name