import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import axios from "axios";

import Navbar from "../components/Navbar.jsx";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

import {
    Search,
    Plus,
    Minus,
    X,
    Download,
    Receipt,
    User,
    Phone,
    Calendar,
    FileSpreadsheet,
    FileText,
    ShoppingBag,
    Trash2,
    Pencil,
    Printer,
} from "lucide-react";

function POS() {
    const [services, setServices] =
        useState([]);

    const [filteredServices, setFilteredServices] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [selectedServiceId, setSelectedServiceId] =
        useState("");

    const [cart, setCart] =
        useState([]);

    const [customerName, setCustomerName] =
        useState("");

    const [customerPhone, setCustomerPhone] =
        useState("");

    const [discount, setDiscount] =
        useState(0);

    const [tax, setTax] =
        useState(18);

    const [paymentMethod, setPaymentMethod] =
        useState("cash");

    const [cashAmount, setCashAmount] =
        useState("");

    const [upiAmount, setUpiAmount] =
        useState("");

    const [cardAmount, setCardAmount] =
        useState("");

    const [salesType, setSalesType] =
        useState("daily");

    const [salesData, setSalesData] =
        useState([]);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [showInvoice, setShowInvoice] =
        useState(false);

    const [currentInvoice, setCurrentInvoice] =
        useState(null);

    const [editingInvoiceId, setEditingInvoiceId] =
        useState(null);

    const [isThermalView, setIsThermalView] =
        useState(false);

    const invoiceRef =
        useRef();

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        fetchSales();
    }, [salesType]);

    useEffect(() => {
        filterServices();
    }, [
        search,
        selectedCategory,
        services,
    ]);

    // FETCH SERVICES
    const fetchServices = async () => {
        try {
            const res =
                await axios.get(
                "https://riva-salon-backend.onrender.com/api/services/"
                );

            const data =
                Array.isArray(
                    res.data
                )
                    ? res.data
                    : [];

            setServices(data);

            setFilteredServices(
                data
            );
        } catch (err) {
            console.log(err);
        }
    };

    // FETCH SALES
    const fetchSales = async () => {
        try {
            const res =
                await axios.get(
                    `https://riva-salon-backend.onrender.com/api/pos/sales-report/?type=${salesType}`
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

            setSalesData(
                res.data.sales || []
            );
        } catch (err) {
            console.log(err);

            setSalesData([]);
        }
    };

    // FILTER
    const categories = [
        "All",
        ...new Set(
            services.map(
                (service) =>
                    service.category ||
                    "General"
            )
        ),
    ];

    const filterServices = () => {
        let filtered = [
            ...services,
        ];

        if (
            selectedCategory !==
            "All"
        ) {
            filtered =
                filtered.filter(
                    (
                        service
                    ) =>
                        (
                            service.category ||
                            "General"
                        ) ===
                        selectedCategory
                );
        }

        if (search) {
            filtered =
                filtered.filter(
                    (
                        service
                    ) =>
                        service.name
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                );
        }

        setFilteredServices(
            filtered
        );
    };

    // ADD TO CART
    const addToCart = (
        service
    ) => {
        if (!service) return;

        const existing =
            cart.find(
                (
                    item
                ) =>
                    item.id ===
                    service.id
            );

        if (existing) {
            setCart(
                cart.map(
                    (
                        item
                    ) =>
                        item.id ===
                        service.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      1,
                              }
                            : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    ...service,
                    quantity: 1,
                },
            ]);
        }
    };

    const handleAddService =
        () => {
            const service =
                services.find(
                    (
                        s
                    ) =>
                        String(
                            s.id
                        ) ===
                        String(
                            selectedServiceId
                        )
                );

            if (!service) {
                alert(
                    "Please select service"
                );

                return;
            }

            addToCart(
                service
            );

            setSelectedServiceId(
                ""
            );
        };

    // QUANTITY
    const increaseQty = (
        id
    ) => {
        setCart(
            cart.map(
                (
                    item
                ) =>
                    item.id ===
                    id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity +
                                  1,
                          }
                        : item
            )
        );
    };

    const decreaseQty = (
        id
    ) => {
        setCart(
            cart
                .map(
                    (
                        item
                    ) =>
                        item.id ===
                        id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity -
                                      1,
                              }
                            : item
                )
                .filter(
                    (
                        item
                    ) =>
                        item.quantity >
                        0
                )
        );
    };

    // CALCULATIONS
    const subtotal =
        useMemo(() => {
            return cart.reduce(
                (
                    acc,
                    item
                ) =>
                    acc +
                    Number(
                        item.price
                    ) *
                        Number(
                            item.quantity
                        ),
                0
            );
        }, [cart]);

    const discountAmount =
        (subtotal *
            Number(
                discount || 0
            )) /
        100;

    const afterDiscount =
        subtotal -
        discountAmount;

    const taxAmount =
        (afterDiscount *
            Number(
                tax || 0
            )) /
        100;

    const total =
        afterDiscount +
        taxAmount;

    // CREATE / UPDATE
    const createInvoice =
        async () => {
            if (
                cart.length ===
                0
            ) {
                alert(
                    "Add services"
                );

                return;
            }

            const payload = {
                customer_name:
                    customerName,

                customer_mobile:
                    customerPhone,

                subtotal,

                discount_percent:
                    discount,

                discount_amount:
                    discountAmount,

                tax_percent:
                    tax,

                tax_amount:
                    taxAmount,

                total_amount:
                    total,

                payment_method:
                    paymentMethod,

                cash_amount:
                    cashAmount ||
                    0,

                upi_amount:
                    upiAmount ||
                    0,

                card_amount:
                    cardAmount ||
                    0,

                items:
                    cart.map(
                        (
                            item
                        ) => ({
                            service:
                                item.id,

                            quantity:
                                item.quantity,

                            price:
                                item.price,

                            total:
                                item.price *
                                item.quantity,
                        })
                    ),
            };

            try {
                if (
                    editingInvoiceId
                ) {
                    await axios.put(
                        `https://riva-salon-backend.onrender.com/api/pos/update/${editingInvoiceId}/`
                        payload,
                        {
                            headers:
                                {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                    )}`,
                                },
                        }
                    );

                    alert(
                        "Invoice Updated"
                    );
                } else {
                    await axios.post(
                        "https://riva-salon-backend.onrender.com/api/pos/create/",
                        payload,
                        {
                            headers:
                                {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                    )}`,
                                },
                        }
                    );
                }

                setCurrentInvoice(
                    {
                        ...payload,
                        items: [
                            ...cart,
                        ],
                    }
                );

                setShowInvoice(
                    true
                );

                setCart([]);

                setCustomerName(
                    ""
                );

                setCustomerPhone(
                    ""
                );

                setDiscount(
                    0
                );

                setCashAmount(
                    ""
                );

                setUpiAmount(
                    ""
                );

                setCardAmount(
                    ""
                );

                setEditingInvoiceId(
                    null
                );

                fetchSales();
            } catch (err) {
                console.log(
                    err
                );

                alert(
                    "Invoice failed"
                );
            }
        };

    // DELETE
    const deleteInvoice =
        async (id) => {
            try {
                await axios.delete(
                    `https://riva-salon-backend.onrender.com/api/pos/delete/${id}/`,
                    {
                        headers:
                            {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                    }
                );

                fetchSales();
            } catch (err) {
                console.log(
                    err
                );
            }
        };

    // EDIT
    const editInvoice =
        async (
            sale
        ) => {
            try {
                const res =
                    await axios.get(
                        "https://riva-salon-backend.onrender.com/api/pos/invoices/",
                        {
                            headers:
                                {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                    )}`,
                                },
                        }
                    );

                const invoices =
                    res.data ||
                    [];

                const fullInvoice =
                    invoices.find(
                        (
                            inv
                        ) =>
                            inv.id ===
                            sale.id
                    );

                if (
                    !fullInvoice
                ) {
                    alert(
                        "Invoice not found"
                    );

                    return;
                }

                setEditingInvoiceId(
                    fullInvoice.id
                );

                setCustomerName(
                    fullInvoice.customer_name ||
                        ""
                );

                setCustomerPhone(
                    fullInvoice.customer_mobile ||
                        ""
                );

                setPaymentMethod(
                    fullInvoice.payment_method ||
                        "cash"
                );

                setDiscount(
                    fullInvoice.discount_percent ||
                        0
                );

                setCart(
                    (
                        fullInvoice.items ||
                        []
                    ).map(
                        (
                            item
                        ) => ({
                            id:
                                item.service ||
                                item.service_id,

                            name:
                                item.service_name ||
                                item.name,

                            price:
                                Number(
                                    item.price
                                ),

                            quantity:
                                Number(
                                    item.quantity
                                ),
                        })
                    )
                );

                setSidebarOpen(
                    true
                );
            } catch (err) {
                console.log(
                    err
                );
            }
        };

    // PDF
    const downloadPDF =
        async () => {
            const input =
                invoiceRef.current;

            const canvas =
                await html2canvas(
                    input,
                    {
                        scale: 3,
                    }
                );

            const imgData =
                canvas.toDataURL(
                    "image/png"
                );

            const pdf =
                new jsPDF(
                    "p",
                    "mm",
                    "a4"
                );

            const pdfWidth =
                pdf.internal.pageSize.getWidth();

            const pdfHeight =
                (canvas.height *
                    pdfWidth) /
                canvas.width;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            pdf.save(
                `RIVA-INVOICE-${Date.now()}.pdf`
            );
        };

    // THERMAL PRINT
    const printThermalBill =
        () => {
            const printContent =
                document.getElementById(
                    "thermal-bill"
                )
                    .innerHTML;

            const WinPrint =
                window.open(
                    "",
                    "",
                    "width=400,height=700"
                );

            WinPrint.document.write(`
                <html>
                <head>
                    <title>Thermal Bill</title>

                    <style>
                        body{
                            font-family: monospace;
                            width:300px;
                            padding:10px;
                        }

                        .line{
                            border-top:1px dashed #000;
                            margin:10px 0;
                        }

                        table{
                            width:100%;
                        }

                        td{
                            padding:3px 0;
                        }
                    </style>
                </head>

                <body onload="window.print();window.close()">
                    ${printContent}
                </body>
                </html>
            `);

            WinPrint.document.close();
        };

    // EXCEL
    const exportSalesExcel =
        () => {
            const worksheet =
                XLSX.utils.json_to_sheet(
                    salesData
                );

            const workbook =
                XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Sales"
            );

            XLSX.writeFile(
                workbook,
                "sales-report.xlsx"
            );
        };

    // PDF REPORT
    const exportSalesPDF =
        () => {
            const pdf =
                new jsPDF();

            let y = 20;

            salesData.forEach(
                (
                    sale,
                    index
                ) => {
                    pdf.text(
                        `${index + 1}. ${
                            sale.customer_name
                        } - ₹${
                            sale.total_amount
                        }`,
                        10,
                        y
                    );

                    y += 10;
                }
            );

            pdf.save(
                "sales-report.pdf"
            );
        };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <Navbar />

            {/* MOBILE FLOAT */}
            <button
                onClick={() =>
                    setSidebarOpen(
                        true
                    )
                }
                className="
                    xl:hidden
                    fixed
                    bottom-5
                    right-5
                    z-50
                    bg-pink-500
                    w-16
                    h-16
                    rounded-full
                    shadow-2xl
                    flex
                    items-center
                    justify-center
                "
            >
                <Receipt />
            </button>

            <div className="p-3 lg:p-6 grid xl:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="xl:col-span-2 space-y-6">
                    {/* ADD SERVICES */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-4 lg:p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <ShoppingBag className="text-pink-500" />

                            <h2 className="text-2xl font-bold">
                                Add Services
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center bg-black border border-zinc-800 rounded-2xl px-4 py-3">
                                <Search size={18} />

                                <input
                                    type="text"
                                    placeholder="Search Service..."
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    className="bg-transparent outline-none w-full ml-3"
                                />
                            </div>

                            <select
                                value={
                                    selectedCategory
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSelectedCategory(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                className="bg-black border border-zinc-800 rounded-2xl px-4 py-3"
                            >
                                {categories.map(
                                    (
                                        category
                                    ) => (
                                        <option
                                            key={
                                                category
                                            }
                                        >
                                            {
                                                category
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-5">
                            <select
                                value={
                                    selectedServiceId
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSelectedServiceId(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                className="flex-1 bg-black border border-zinc-800 rounded-2xl px-4 py-4"
                            >
                                <option value="">
                                    Select Service
                                </option>

                                {filteredServices.map(
                                    (
                                        service
                                    ) => (
                                        <option
                                            key={
                                                service.id
                                            }
                                            value={
                                                service.id
                                            }
                                        >
                                            {
                                                service.name
                                            }{" "}
                                            - ₹
                                            {
                                                service.price
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <button
                                onClick={
                                    handleAddService
                                }
                                className="bg-pink-500 hover:bg-pink-600 px-6 py-4 rounded-2xl font-bold"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* SALES REPORT */}
                    <div className="bg-zinc-900 rounded-[32px] p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Calendar className="text-pink-500" />
                                Sales Report
                            </h2>

                            <div className="flex gap-3 flex-wrap">
                                <select
                                    value={
                                        salesType
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSalesType(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    className="bg-black border border-zinc-700 rounded-2xl px-4 py-3"
                                >
                                    <option value="daily">
                                        Daily
                                    </option>

                                    <option value="monthly">
                                        Monthly
                                    </option>

                                    <option value="yearly">
                                        Yearly
                                    </option>
                                </select>

                                <button
                                    onClick={
                                        exportSalesPDF
                                    }
                                    className="bg-pink-500 px-5 rounded-2xl font-bold flex items-center gap-2 py-3"
                                >
                                    <FileText size={18} />
                                    PDF
                                </button>

                                <button
                                    onClick={
                                        exportSalesExcel
                                    }
                                    className="bg-green-600 px-5 rounded-2xl font-bold flex items-center gap-2 py-3"
                                >
                                    <FileSpreadsheet size={18} />
                                    Excel
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <div className="max-h-[420px] overflow-y-auto border border-zinc-800 rounded-2xl min-w-[800px]">
                                <table className="w-full">
                                    <thead className="bg-black sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4 text-left">
                                                Customer
                                            </th>

                                            <th className="p-4 text-left">
                                                Mobile
                                            </th>

                                            <th className="p-4 text-left">
                                                Amount
                                            </th>

                                            <th className="p-4 text-left">
                                                Payment
                                            </th>

                                            <th className="p-4 text-left">
                                                Date
                                            </th>

                                            <th className="p-4 text-left">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {salesData.map(
                                            (
                                                sale
                                            ) => (
                                                <tr
                                                    key={
                                                        sale.id
                                                    }
                                                    className="border-t border-zinc-800"
                                                >
                                                    <td className="p-4">
                                                        {
                                                            sale.customer_name
                                                        }
                                                    </td>

                                                    <td className="p-4">
                                                        {
                                                            sale.customer_mobile
                                                        }
                                                    </td>

                                                    <td className="p-4 text-pink-500 font-bold">
                                                        ₹
                                                        {
                                                            sale.total_amount
                                                        }
                                                    </td>

                                                    <td className="p-4 uppercase">
                                                        {
                                                            sale.payment_method
                                                        }
                                                    </td>

                                                    <td className="p-4">
                                                        {new Date(
                                                            sale.created_at
                                                        ).toLocaleString()}
                                                    </td>

                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    editInvoice(
                                                                        sale
                                                                    )
                                                                }
                                                                className="bg-yellow-500 text-black px-3 py-2 rounded-xl"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    deleteInvoice(
                                                                        sale.id
                                                                    )
                                                                }
                                                                className="bg-red-500 text-white px-3 py-2 rounded-xl"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* TOTAL */}
                        <div className="mt-5 flex justify-end">
                            <div className="bg-black border border-zinc-800 rounded-2xl px-6 py-4">
                                <p className="text-zinc-400 text-sm">
                                    Total Sales
                                </p>

                                <h2 className="text-3xl font-black text-pink-500">
                                    ₹
                                    {salesData
                                        .reduce(
                                            (
                                                acc,
                                                item
                                            ) =>
                                                acc +
                                                Number(
                                                    item.total_amount ||
                                                        0
                                                ),
                                            0
                                        )
                                        .toFixed(
                                            2
                                        )}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div
                    className={`
                        fixed xl:static top-0 right-0
                        w-full sm:w-[420px]
                        h-screen xl:h-auto
                        bg-zinc-950 xl:bg-zinc-900
                        z-50
                        transition-all duration-300
                        overflow-y-auto
                        ${
                            sidebarOpen
                                ? "translate-x-0"
                                : "translate-x-full xl:translate-x-0"
                        }
                    `}
                >
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-pink-500 flex items-center gap-2">
                                <Receipt />
                                Invoice
                            </h2>

                            <button
                                onClick={() =>
                                    setSidebarOpen(
                                        false
                                    )
                                }
                                className="xl:hidden"
                            >
                                <X />
                            </button>
                        </div>

                        {/* CUSTOMER */}
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute top-4 left-4 text-zinc-500" />

                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={
                                        customerName
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setCustomerName(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    className="w-full bg-black border border-zinc-700 rounded-2xl py-3 pl-12 pr-4"
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute top-4 left-4 text-zinc-500" />

                                <input
                                    type="number"
                                    placeholder="Mobile Number"
                                    value={
                                        customerPhone
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setCustomerPhone(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    className="w-full bg-black border border-zinc-700 rounded-2xl py-3 pl-12 pr-4"
                                />
                            </div>
                        </div>

                        {/* CART */}
                        <div className="space-y-4 mt-6">
                            {cart.map(
                                (
                                    item
                                ) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="bg-black border border-zinc-800 rounded-2xl p-4"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-bold">
                                                    {
                                                        item.name
                                                    }
                                                </h3>

                                                <p className="text-pink-500">
                                                    ₹
                                                    {
                                                        item.price
                                                    }
                                                </p>
                                            </div>

                                            <p className="font-bold">
                                                ₹
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() =>
                                                    decreaseQty(
                                                        item.id
                                                    )
                                                }
                                                className="bg-zinc-800 w-9 h-9 rounded-xl flex items-center justify-center"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span>
                                                {
                                                    item.quantity
                                                }
                                            </span>

                                            <button
                                                onClick={() =>
                                                    increaseQty(
                                                        item.id
                                                    )
                                                }
                                                className="bg-zinc-800 w-9 h-9 rounded-xl flex items-center justify-center"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* TOTAL */}
                        <div className="mt-6 border-t border-zinc-800 pt-5 space-y-4">
                            <input
                                type="number"
                                placeholder="Discount %"
                                value={
                                    discount
                                }
                                onChange={(
                                    e
                                ) =>
                                    setDiscount(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                className="w-full bg-black border border-zinc-700 rounded-2xl p-3"
                            />

                            <select
                                value={
                                    paymentMethod
                                }
                                onChange={(
                                    e
                                ) =>
                                    setPaymentMethod(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                className="w-full bg-black border border-zinc-700 rounded-2xl p-3"
                            >
                                <option value="cash">
                                    Cash
                                </option>

                                <option value="upi">
                                    UPI
                                </option>

                                <option value="card">
                                    Card
                                </option>

                                <option value="split">
                                    Split
                                </option>
                            </select>

                            {paymentMethod ===
                                "split" && (
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        placeholder="Cash Amount"
                                        value={
                                            cashAmount
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setCashAmount(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full bg-black border border-zinc-700 rounded-2xl p-3"
                                    />

                                    <input
                                        type="number"
                                        placeholder="UPI Amount"
                                        value={
                                            upiAmount
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setUpiAmount(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full bg-black border border-zinc-700 rounded-2xl p-3"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Card Amount"
                                        value={
                                            cardAmount
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setCardAmount(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full bg-black border border-zinc-700 rounded-2xl p-3"
                                    />
                                </div>
                            )}

                            <div className="bg-black rounded-3xl border border-zinc-800 p-5 space-y-4">
                                <div className="flex justify-between">
                                    <p>
                                        Subtotal
                                    </p>

                                    <p>
                                        ₹
                                        {subtotal.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>

                                <div className="flex justify-between text-red-400">
                                    <p>
                                        Discount
                                    </p>

                                    <p>
                                        - ₹
                                        {discountAmount.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>

                                <div className="flex justify-between text-yellow-400">
                                    <p>
                                        GST
                                    </p>

                                    <p>
                                        ₹
                                        {taxAmount.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>

                                <div className="border-t border-zinc-700 pt-4 flex justify-between text-4xl font-black text-pink-500">
                                    <p>
                                        Total
                                    </p>

                                    <p>
                                        ₹
                                        {total.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={
                                    createInvoice
                                }
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-4 rounded-2xl font-bold"
                            >
                                {editingInvoiceId
                                    ? "Update Invoice"
                                    : "Generate Invoice"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* INVOICE MODAL */}
            {showInvoice &&
                currentInvoice && (
                    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-[32px] overflow-hidden w-full max-w-5xl shadow-2xl">
                            {/* TOP */}
                            <div className="flex gap-3 p-4 bg-zinc-100 border-b flex-wrap">
                                <button
                                    onClick={() =>
                                        setIsThermalView(
                                            false
                                        )
                                    }
                                    className={`px-4 py-2 rounded-xl font-bold ${
                                        !isThermalView
                                            ? "bg-black text-white"
                                            : "bg-white border"
                                    }`}
                                >
                                    Normal Bill
                                </button>

                                <button
                                    onClick={() =>
                                        setIsThermalView(
                                            true
                                        )
                                    }
                                    className={`px-4 py-2 rounded-xl font-bold ${
                                        isThermalView
                                            ? "bg-black text-white"
                                            : "bg-white border"
                                    }`}
                                >
                                    Thermal Bill
                                </button>
                            </div>

                            {/* NORMAL */}
                            {!isThermalView && (
                                <div
                                    ref={
                                        invoiceRef
                                    }
                                    className="text-black p-6 sm:p-10"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <h1 className="text-5xl font-black">
                                                RIVA
                                            </h1>

                                            <p>
                                                Luxury Salon & Spa
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <h2 className="text-3xl font-black">
                                                INVOICE
                                            </h2>

                                            <p>
                                                {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-zinc-500">
                                                Customer
                                            </p>

                                            <h2 className="text-2xl font-black">
                                                {
                                                    currentInvoice.customer_name
                                                }
                                            </h2>

                                            <p>
                                                {
                                                    currentInvoice.customer_mobile
                                                }
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-zinc-500">
                                                Payment
                                            </p>

                                            <h2 className="text-2xl font-black uppercase">
                                                {
                                                    currentInvoice.payment_method
                                                }
                                            </h2>
                                        </div>
                                    </div>

                                    {/* ITEMS */}
                                    <div className="mt-8 overflow-x-auto">
                                        <table className="w-full border">
                                            <thead className="bg-zinc-100">
                                                <tr>
                                                    <th className="p-3 text-left">
                                                        Service
                                                    </th>

                                                    <th className="p-3">
                                                        Qty
                                                    </th>

                                                    <th className="p-3">
                                                        Price
                                                    </th>

                                                    <th className="p-3 text-right">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {currentInvoice.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={
                                                                index
                                                            }
                                                            className="border-t"
                                                        >
                                                            <td className="p-3">
                                                                {
                                                                    item.name
                                                                }
                                                            </td>

                                                            <td className="p-3 text-center">
                                                                {
                                                                    item.quantity
                                                                }
                                                            </td>

                                                            <td className="p-3 text-center">
                                                                ₹
                                                                {
                                                                    item.price
                                                                }
                                                            </td>

                                                            <td className="p-3 text-right font-bold">
                                                                ₹
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* TOTALS */}
                                    <div className="flex justify-end mt-8">
                                        <div className="w-full max-w-md space-y-3">
                                            <div className="flex justify-between">
                                                <span>
                                                    Subtotal
                                                </span>

                                                <span>
                                                    ₹
                                                    {currentInvoice.subtotal.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span>
                                                    Discount
                                                </span>

                                                <span>
                                                    ₹
                                                    {currentInvoice.discount_amount.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span>
                                                    GST
                                                </span>

                                                <span>
                                                    ₹
                                                    {currentInvoice.tax_amount.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>

                                            <div className="border-t pt-4 flex justify-between text-3xl font-black">
                                                <span>
                                                    Total
                                                </span>

                                                <span className="text-pink-600">
                                                    ₹
                                                    {currentInvoice.total_amount.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* THERMAL */}
                            {isThermalView && (
                                <div
                                    id="thermal-bill"
                                    className="text-black p-5 w-full max-w-[320px] mx-auto"
                                >
                                    <div className="text-center">
                                        <h1 className="text-3xl font-black">
                                            RIVA
                                        </h1>

                                        <p>
                                            Luxury Salon & Spa
                                        </p>

                                        <p>
                                            {new Date().toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="border-t border-dashed my-3" />

                                    <p>
                                        Customer :
                                        {
                                            currentInvoice.customer_name
                                        }
                                    </p>

                                    <p>
                                        Mobile :
                                        {
                                            currentInvoice.customer_mobile
                                        }
                                    </p>

                                    <p className="uppercase">
                                        Payment :
                                        {
                                            currentInvoice.payment_method
                                        }
                                    </p>

                                    <div className="border-t border-dashed my-3" />

                                    {currentInvoice.items.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="mb-2"
                                            >
                                                <div className="flex justify-between">
                                                    <span>
                                                        {
                                                            item.name
                                                        }
                                                    </span>

                                                    <span>
                                                        ₹
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="text-xs">
                                                    {
                                                        item.quantity
                                                    }{" "}
                                                    x ₹
                                                    {
                                                        item.price
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}

                                    <div className="border-t border-dashed my-3" />

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>
                                                Subtotal
                                            </span>

                                            <span>
                                                ₹
                                                {currentInvoice.subtotal.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>
                                                Discount
                                            </span>

                                            <span>
                                                ₹
                                                {currentInvoice.discount_amount.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>
                                                GST
                                            </span>

                                            <span>
                                                ₹
                                                {currentInvoice.tax_amount.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>

                                        <div className="border-t border-dashed pt-2 flex justify-between text-xl font-black">
                                            <span>
                                                Total
                                            </span>

                                            <span>
                                                ₹
                                                {currentInvoice.total_amount.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed my-3" />

                                    <div className="text-center">
                                        <p>
                                            Thank You ❤️
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* FOOTER */}
                            <div className="bg-zinc-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                                {!isThermalView ? (
                                    <button
                                        onClick={
                                            downloadPDF
                                        }
                                        className="flex-1 bg-pink-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <Download size={20} />
                                        Download PDF
                                    </button>
                                ) : (
                                    <button
                                        onClick={
                                            printThermalBill
                                        }
                                        className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <Printer size={20} />
                                        Print Thermal Bill
                                    </button>
                                )}

                                <button
                                    onClick={() =>
                                        setShowInvoice(
                                            false
                                        )
                                    }
                                    className="flex-1 bg-zinc-300 text-black py-4 rounded-2xl font-bold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default POS;