from django.db import models
from django.conf import settings
from booking.models import Booking

User = settings.AUTH_USER_MODEL


class Payment(models.Model):
    PAYMENT_METHODS = (
        ('cash', 'Cash'),
        ('online', 'Online'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"{self.user} - {self.amount} - {self.status}"