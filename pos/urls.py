from django.urls import path

from .views import (
    CreateInvoiceView,
    InvoiceListView,
    SalesReportView,
    ExportExcelView,
    DeleteInvoiceView,
    UpdateInvoiceView,
)

urlpatterns = [

    # CREATE INVOICE
    path(
        "create/",
        CreateInvoiceView.as_view(),
        name="create-invoice"
    ),

    # ALL INVOICES
    path(
        "invoices/",
        InvoiceListView.as_view(),
        name="invoice-list"
    ),

    # SALES REPORT
    path(
        "sales-report/",
        SalesReportView.as_view(),
        name="sales-report"
    ),

    # EXPORT EXCEL
    path(
        "export-excel/",
        ExportExcelView.as_view(),
        name="export-excel"
    ),

    # ✅ DELETE INVOICE (FIX FOR YOUR ERROR)
    path(
        "delete/<int:pk>/",
        DeleteInvoiceView.as_view(),
        name="delete-invoice"
    ),

      path(
        "update/<int:pk>/",
        UpdateInvoiceView.as_view(),
        name="delete-invoice"
    ),
]