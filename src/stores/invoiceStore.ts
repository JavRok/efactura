import { map } from "nanostores";

export interface InvoiceLine {
  detail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string; // DD/MM/YYYY
  // From
  myCompanyName: string;
  myCompanyEmail: string;
  myCompanyPhone: string;
  myCompanyAddress: string;
  // To
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  // Products or services
  invoiceLines: InvoiceLine[];
  // Totals
  showVAT: boolean;
  showIncomeTax: boolean;
  vatRate: number;
  vatTotal: number;
  incomeTaxRate: number;
  incomeTax: number;
  subtotal: number;
  total: number;
  // Payment info
  paymentBank: string;
  paymentName: string;
  paymentIBAN: string;
  paymentSWIFT: string;
}

// Default values for the invoice
export const invoiceStore = map<InvoiceData>({
  invoiceNumber: "2025-002",
  invoiceDate: "1/1/2025", // new Date().toLocaleDateString("es-ES") ??
  myCompanyName: "Empresa Innovadora SL",
  myCompanyEmail: "contacto@empresainnovadora.com",
  myCompanyPhone: "634-789-0123",
  myCompanyAddress: "Avenida Principal 45, 28001 Madrid",
  companyName: "Servicios Digitales XYZ",
  companyEmail: "info@serviciosdigitalesxyz.es",
  companyPhone: "912-456-7890",
  companyAddress: "Calle Tecnología 78, 08005 Barcelona",
  invoiceLines: [
    {
      detail: "Servicio de diseño web",
      quantity: 1,
      unitPrice: 1000,
      totalPrice: 1000,
    },
    {
      detail: "Portatiles",
      quantity: 3,
      unitPrice: 500,
      totalPrice: 1500,
    },
  ],
  showVAT: true,
  showIncomeTax: true,
  vatRate: 21,
  vatTotal: 525,
  incomeTaxRate: 15, // 7% or 15%
  incomeTax: -375,
  subtotal: 2500,
  total: 2650,
  paymentBank: "Banco Santander",
  paymentName: "Servicios Digitales XYZ",
  paymentIBAN: "ES91 2100 0418 4502 0005 1332",
  paymentSWIFT: "CAIXESBBXXX",

  website: "WWW.SERVICIOSDIGITALESXYZ.ES",
});

// Helper functions to update single fields in the store
export function updateInvoiceField(
  field: keyof InvoiceData,
  value: string | number,
) {
  const $invoice = getInvoiceData();
  const { invoiceLines, vatRate, incomeTaxRate } = $invoice;
  if (field in $invoice && field !== "invoiceLines") {
    let totals = {};
    if (field === "vatRate") {
      totals = calculateTotals(invoiceLines, value as number, incomeTaxRate);
    }
    if (field === "incomeTaxRate") {
      totals = calculateTotals(invoiceLines, vatRate, value as number);
    }
    invoiceStore.set({
      ...$invoice,
      ...totals,
      [field]: value,
    });
  }
  // notifyStoreUpdate();
}

function calculateTotals(
  invoiceLines: InvoiceLine[],
  vatRate: number,
  incomeTaxRate: number,
) {
  const subtotal = invoiceLines.reduce((acc, line) => acc + line.totalPrice, 0);
  const vatTotal = (subtotal * vatRate) / 100;
  const incomeTax = -subtotal * (incomeTaxRate / 100);
  return {
    subtotal,
    vatTotal,
    incomeTax,
    total: subtotal + vatTotal + incomeTax,
  };
}

// Helper to update a field in the invoiceLines array
export function updateInvoiceLine(
  index: number,
  field: keyof InvoiceLine,
  value: string | number,
): void {
  const $invoice = getInvoiceData();
  const { invoiceLines, vatRate, incomeTaxRate } = $invoice;
  const updatedLines = [...invoiceLines];

  if (index >= 0 && index < updatedLines.length) {
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: value,
    };

    // Recalculate total price for the updated line
    updatedLines[index].totalPrice =
      updatedLines[index].quantity * updatedLines[index].unitPrice;

    invoiceStore.set({
      ...$invoice,
      ...calculateTotals(updatedLines, vatRate, incomeTaxRate),
      invoiceLines: updatedLines,
    });
  }
}

// Function to get all data (useful for form submission)
export function getInvoiceData(): InvoiceData {
  return invoiceStore.get();
}

// Get invoice simple field
export function getInvoiceField(field: string): string | boolean | null {
  if (field === "invoiceLines") {
    return null;
  }
  const store = invoiceStore.get();
  // if (field.startsWith("invoiceLines") && Array.isArray(invoiceStore.get()[field])) {
  //   return invoiceStore.get()[field].map((line) => ({...line }));
  // }
  if (field in store) {
    return store[field];
  }
  return null;
}

// Get invoice lines
export function getInvoiceLines(): InvoiceLine[] {
  return invoiceStore.get().invoiceLines;
}

// Function to submit the data
// TODO: Move somewhere else
export async function submitInvoiceData(endpoint: string) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getInvoiceData()),
    });

    return await response.json();
  } catch (error) {
    console.error("Error submitting invoice data:", error);
    throw error;
  }
}

export function addInvoiceLine() {
  const $invoice = getInvoiceData();
  const { invoiceLines, vatRate, incomeTaxRate } = $invoice;
  const newLine: InvoiceLine = {
    detail: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  };

  const newInvoiceLines = [...invoiceLines, newLine];
  invoiceStore.set({
    ...$invoice,
    ...calculateTotals(newInvoiceLines, vatRate, incomeTaxRate),
    invoiceLines: newInvoiceLines,
  });
}

export function removeInvoiceLine(index: number) {
  const $invoice = getInvoiceData();
  const { invoiceLines, vatRate, incomeTaxRate } = $invoice;
  if (index >= 0 && index < invoiceLines.length) {
    const newInvoiceLines = [
      ...invoiceLines.slice(0, index),
      ...invoiceLines.slice(index + 1),
    ];
    invoiceStore.set({
      ...$invoice,
      ...calculateTotals(newInvoiceLines, vatRate, incomeTaxRate),
      invoiceLines: newInvoiceLines,
    });
  }
}

// Helper function to dispatch store update event
// const notifyStoreUpdate = () => {
//   if (typeof window !== "undefined") {
//     const event = new CustomEvent("invoice-store-updated");
//     document.dispatchEvent(event);
//   }
// };

// DEBUG STORE, disable in production
if (typeof window !== "undefined") {
  // Only run this code in the browser
  invoiceStore.listen((value) => {
    console.log("Invoice Store Updated:", value);
  });
}
