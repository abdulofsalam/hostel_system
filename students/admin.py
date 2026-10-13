from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'cnic',
        'phone',
        'room',
        'monthly_rent',
        'is_active',
        'admission_date',
    )

    search_fields = (
        'full_name',
        'cnic',
        'phone',
    )

    list_filter = (
        'is_active',
        'admission_date',
    )