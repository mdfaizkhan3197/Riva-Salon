from django.db import models
from django.conf import settings
from services.models import Service


class Invoice(models.Model):

    PAYMENT_CHOICES = (
        ('cash', 'Cash'),
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('split', 'Split'),
    )

    customer_name = models.CharField(
        max_length=255
    )

    customer_mobile = models.CharField(
        max_length=20
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    tax_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=18
    )

    tax_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES
    )

    cash_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    upi_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    card_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Invoice #{self.id}"


class InvoiceItem(models.Model):

    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='items'
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return self.service.name