from django.contrib import admin
from .models import Hostel


@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'owner',
        'phone',
        'created_at',
    )

    search_fields = (
        'name',
        'owner__username',
        'phone',
    )

    list_filter = (
        'created_at',
    )