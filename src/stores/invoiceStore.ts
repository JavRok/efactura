import { map } from "nanostores";

export interface InvoiceData {
  invoiceNumber: string;
  myCompanyName: string;
  myCompanyEmail: string;
  myCompanyPhone: string;
  myCompanyAddress: string;
  // Add other fields as needed
}

// Default values for the invoice
export const invoiceStore = map<InvoiceData>({
  invoiceNumber: "2023-0042",
  myCompanyName: "Empresa Innovadora SL",
  myCompanyEmail: "contacto@empresainnovadora.com",
  myCompanyPhone: "634-789-0123",
  myCompanyAddress: "Avenida Principal 45, 28001 Madrid",
  // Add other default values
});

// Helper functions to update the store
export function updateInvoiceField(field: keyof InvoiceData, value: string) {
  invoiceStore.set({
    ...invoiceStore.get(),
    [field]: value,
  });
}

// Function to get all data (useful for form submission)
export function getInvoiceData(): InvoiceData {
  return invoiceStore.get();
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
