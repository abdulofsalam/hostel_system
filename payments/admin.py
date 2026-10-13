from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'student',
        'amount',
        'payment_date',
        'payment_for_month',
        'payment_method',
    )

    search_fields = (
        'student__full_name',
        'student__cnic',
        'transaction_id',
    )

    list_filter = (
        'payment_method',
        'payment_date',
        'payment_for_month',
    )