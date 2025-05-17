import { map } from "nanostores";

export interface InvoiceLine {
  detail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface InvoiceData {
  invoiceNumber: string;
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
}

// Default values for the invoice
export const invoiceStore = map<InvoiceData>({
  invoiceNumber: "2025-002",
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
});

// Helper functions to update single fields in the store
export function updateInvoiceField(field: keyof InvoiceData, value: string) {
  const currentData = invoiceStore.get();
  if (field in currentData && field !== "invoiceLines") {
    invoiceStore.set({
      ...currentData,
      [field]: value,
    });
  }
}

// Helper to update a field in the invoiceLines array
export function updateInvoiceLine(
  index: number,
  field: keyof InvoiceLine,
  value: string | number,
): void {
  const currentData = invoiceStore.get();
  const updatedLines = [...currentData.invoiceLines];

  if (index >= 0 && index < updatedLines.length) {
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: value,
    };

    invoiceStore.set({
      ...currentData,
      invoiceLines: updatedLines,
    });
  }
}

// Function to get all data (useful for form submission)
export function getInvoiceData(): InvoiceData {
  return invoiceStore.get();
}

export function getInvoiceField(field: string): string | InvoiceLine[] | null {
  const store = invoiceStore.get();
  // if (field.startsWith("invoiceLines") && Array.isArray(invoiceStore.get()[field])) {
  //   return invoiceStore.get()[field].map((line) => ({...line }));
  // }
  if (field in store) {
    return store[field];
  }
  return null;
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

// DEBUG STORE, disable in production
if (typeof window !== "undefined") {
  // Only run this code in the browser
  invoiceStore.listen((value) => {
    console.log("Invoice Store Updated:", value);
  });
}
