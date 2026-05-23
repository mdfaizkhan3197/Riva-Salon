from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.http import HttpResponse
from django.db.models import Sum
from django.utils.timezone import now

from openpyxl import Workbook

from .models import Invoice, InvoiceItem
from .serializers import InvoiceSerializer

from services.models import Service


# =========================================
# CREATE INVOICE
# =========================================
class CreateInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        try:

            invoice = Invoice.objects.create(
                customer_name=data.get("customer_name"),
                customer_mobile=data.get("customer_mobile"),

                subtotal=data.get("subtotal", 0),

                discount_percent=data.get(
                    "discount_percent",
                    0
                ),

                discount_amount=data.get(
                    "discount_amount",
                    0
                ),

                tax_percent=data.get(
                    "tax_percent",
                    18
                ),

                tax_amount=data.get(
                    "tax_amount",
                    0
                ),

                total_amount=data.get(
                    "total_amount",
                    0
                ),

                payment_method=data.get(
                    "payment_method"
                ),

                cash_amount=data.get(
                    "cash_amount",
                    0
                ),

                upi_amount=data.get(
                    "upi_amount",
                    0
                ),

                card_amount=data.get(
                    "card_amount",
                    0
                ),
            )

            # SAVE ITEMS
            for item in data.get("items", []):

                try:

                    service = Service.objects.get(
                        id=item.get("service")
                    )

                    InvoiceItem.objects.create(
                        invoice=invoice,

                        service=service,

                        quantity=item.get(
                            "quantity",
                            1
                        ),

                        price=item.get(
                            "price",
                            0
                        ),

                        total=item.get(
                            "total",
                            0
                        ),
                    )

                except Service.DoesNotExist:
                    continue

            serializer = InvoiceSerializer(invoice)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# =========================================
# ALL INVOICES
# =========================================
class InvoiceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        invoices = Invoice.objects.all().order_by(
            "-created_at"
        )

        serializer = InvoiceSerializer(
            invoices,
            many=True
        )

        return Response(serializer.data)


# =========================================
# SINGLE INVOICE DETAILS
# =========================================
class InvoiceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:

            invoice = Invoice.objects.get(id=pk)

            serializer = InvoiceSerializer(invoice)

            return Response(serializer.data)

        except Invoice.DoesNotExist:

            return Response(
                {
                    "error": "Invoice not found"
                },
                status=404
            )


# =========================================
# UPDATE INVOICE
# =========================================
class UpdateInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        try:

            invoice = Invoice.objects.get(id=pk)

            data = request.data

            invoice.customer_name = data.get(
                "customer_name",
                invoice.customer_name
            )

            invoice.customer_mobile = data.get(
                "customer_mobile",
                invoice.customer_mobile
            )

            invoice.subtotal = data.get(
                "subtotal",
                invoice.subtotal
            )

            invoice.discount_percent = data.get(
                "discount_percent",
                invoice.discount_percent
            )

            invoice.discount_amount = data.get(
                "discount_amount",
                invoice.discount_amount
            )

            invoice.tax_percent = data.get(
                "tax_percent",
                invoice.tax_percent
            )

            invoice.tax_amount = data.get(
                "tax_amount",
                invoice.tax_amount
            )

            invoice.total_amount = data.get(
                "total_amount",
                invoice.total_amount
            )

            invoice.payment_method = data.get(
                "payment_method",
                invoice.payment_method
            )

            invoice.cash_amount = data.get(
                "cash_amount",
                invoice.cash_amount
            )

            invoice.upi_amount = data.get(
                "upi_amount",
                invoice.upi_amount
            )

            invoice.card_amount = data.get(
                "card_amount",
                invoice.card_amount
            )

            invoice.save()

            # DELETE OLD ITEMS
            invoice.items.all().delete()

            # CREATE NEW ITEMS
            for item in data.get("items", []):

                try:

                    service = Service.objects.get(
                        id=item.get("service")
                    )

                    InvoiceItem.objects.create(
                        invoice=invoice,

                        service=service,

                        quantity=item.get(
                            "quantity",
                            1
                        ),

                        price=item.get(
                            "price",
                            0
                        ),

                        total=item.get(
                            "total",
                            0
                        ),
                    )

                except Service.DoesNotExist:
                    continue

            serializer = InvoiceSerializer(invoice)

            return Response(serializer.data)

        except Invoice.DoesNotExist:

            return Response(
                {
                    "error": "Invoice not found"
                },
                status=404
            )


# =========================================
# DELETE INVOICE
# =========================================
class DeleteInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        try:

            invoice = Invoice.objects.get(id=pk)

            invoice.delete()

            return Response(
                {
                    "message":
                    "Invoice deleted successfully"
                },
                status=200
            )

        except Invoice.DoesNotExist:

            return Response(
                {
                    "error": "Invoice not found"
                },
                status=404
            )


# =========================================
# SALES REPORT
# =========================================
class SalesReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        report_type = request.GET.get(
            "type",
            "daily"
        )

        selected_date = request.GET.get(
            "date"
        )

        selected_month = request.GET.get(
            "month"
        )

        selected_year = request.GET.get(
            "year"
        )

        invoices = Invoice.objects.all().order_by(
            "-created_at"
        )

        current = now()

        # DAILY FILTER
        if report_type == "daily":

            if selected_date:

                invoices = invoices.filter(
                    created_at__date=selected_date
                )

            else:

                invoices = invoices.filter(
                    created_at__date=current.date()
                )

        # MONTHLY FILTER
        elif report_type == "monthly":

            if selected_month:

                year, month = selected_month.split("-")

                invoices = invoices.filter(
                    created_at__year=year,
                    created_at__month=month
                )

            else:

                invoices = invoices.filter(
                    created_at__year=current.year,
                    created_at__month=current.month
                )

        # YEARLY FILTER
        elif report_type == "yearly":

            if selected_year:

                invoices = invoices.filter(
                    created_at__year=selected_year
                )

            else:

                invoices = invoices.filter(
                    created_at__year=current.year
                )

        sales = []

        total_sales = invoices.aggregate(
            total=Sum("total_amount")
        )["total"] or 0

        total_discount = invoices.aggregate(
            total=Sum("discount_amount")
        )["total"] or 0

        total_tax = invoices.aggregate(
            total=Sum("tax_amount")
        )["total"] or 0

        for invoice in invoices:

            sales.append({
                "id": invoice.id,

                "customer_name":
                    invoice.customer_name,

                "customer_mobile":
                    invoice.customer_mobile,

                "subtotal":
                    invoice.subtotal,

                "discount_percent":
                    invoice.discount_percent,

                "discount_amount":
                    invoice.discount_amount,

                "tax_percent":
                    invoice.tax_percent,

                "tax_amount":
                    invoice.tax_amount,

                "total_amount":
                    invoice.total_amount,

                "payment_method":
                    invoice.payment_method,

                "cash_amount":
                    invoice.cash_amount,

                "upi_amount":
                    invoice.upi_amount,

                "card_amount":
                    invoice.card_amount,

                "created_at":
                    invoice.created_at,
            })

        return Response({
            "sales": sales,

            "total_sales": total_sales,

            "total_discount": total_discount,

            "total_tax": total_tax,

            "count": invoices.count(),
        })


# =========================================
# EXPORT EXCEL
# =========================================
class ExportExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        workbook = Workbook()

        sheet = workbook.active

        sheet.title = "Sales Report"

        headers = [
            "Invoice ID",
            "Customer Name",
            "Mobile",
            "Subtotal",
            "Discount %",
            "Discount Amount",
            "GST %",
            "GST Amount",
            "Total Amount",
            "Payment Method",
            "Cash Amount",
            "UPI Amount",
            "Card Amount",
            "Date",
        ]

        sheet.append(headers)

        invoices = Invoice.objects.all().order_by(
            "-created_at"
        )

        grand_total = 0

        for invoice in invoices:

            grand_total += float(
                invoice.total_amount
            )

            sheet.append([
                invoice.id,

                invoice.customer_name,

                invoice.customer_mobile,

                float(invoice.subtotal),

                float(invoice.discount_percent),

                float(invoice.discount_amount),

                float(invoice.tax_percent),

                float(invoice.tax_amount),

                float(invoice.total_amount),

                invoice.payment_method,

                float(invoice.cash_amount),

                float(invoice.upi_amount),

                float(invoice.card_amount),

                invoice.created_at.strftime(
                    "%d-%m-%Y %H:%M"
                ),
            ])

        # FINAL TOTAL ROW
        sheet.append([])

        sheet.append([
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "TOTAL SALES",
            grand_total
        ])

        response = HttpResponse(
            content_type=
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        response[
            "Content-Disposition"
        ] = 'attachment; filename="sales_report.xlsx"'

        workbook.save(response)

        return response