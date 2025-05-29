import type { InvoiceData } from "../../stores/invoiceStore";

export interface FieldRule {
  xmlPath: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  helpText: string;
  defaultValue?: string;
}

// Based on Facturae 3.2.2 XSD schema
export const invoiceFieldMappings: Record<
  Partial<keyof InvoiceData>,
  FieldRule
> = {
  // Header fields
  invoiceNumber: {
    xmlPath: "Invoices/Invoice/InvoiceHeader/InvoiceNumber",
    required: true,
    maxLength: 20,
    helpText: "Número único de factura",
  },
  invoiceDate: {
    xmlPath: "Invoices/Invoice/InvoiceIssueData/IssueDate",
    required: true,
    helpText: "Fecha de emisión de la factura",
    defaultValue: new Date().toISOString().split("T")[0],
  },

  // Seller information
  myCompanyName: {
    xmlPath: "Parties/SellerParty/LegalEntity/CorporateName",
    required: true,
    maxLength: 80,
    helpText:
      "Razon social: para un autonomo es su nombre y apellidos. Para una empresa es su nombre registrado",
  },
  myFiscalNumber: {
    xmlPath: "Parties/SellerParty/TaxIdentification/TaxIdentificationNumber",
    required: true,
    maxLength: 30,
    minLength: 3,
    helpText: "NIF de la empresa emisora",
  },
  myCompanyEmail: {
    xmlPath: "Parties/SellerParty/LegalEntity/ContactDetails/ElectronicMail",
    required: false,
    maxLength: 60,
  },
  myCompanyPhone: {
    xmlPath: "Parties/SellerParty/LegalEntity/ContactDetails/Telephone",
    required: true,
    maxLength: 15,
  },
  myCompanyAddress: {
    xmlPath: "Parties/SellerParty/LegalEntity/AddressInSpain/Address",
    required: true,
    maxLength: 80,
  },
  myCompanyPostCode: {
    xmlPath: "Parties/SellerParty/LegalEntity/AddressInSpain/PostCode",
    required: true,
    pattern: /^\d{5}$/,
    helpText: "Código postal (5 dígitos)",
  },
  myCompanyTown: {
    xmlPath: "Parties/SellerParty/LegalEntity/AddressInSpain/Town",
    required: true,
    maxLength: 50,
    helpText: "Población",
  },
  myCompanyProvince: {
    xmlPath: "Parties/SellerParty/LegalEntity/AddressInSpain/Province",
    required: true,
    maxLength: 20,
    helpText: "Provincia",
  },

  // Buyer information
  companyName: {
    xmlPath: "Parties/BuyerParty/LegalEntity/CorporateName",
    required: true,
    maxLength: 80,
    helpText: "Nombre de la empresa receptora",
  },
  fiscalNumber: {
    xmlPath: "Parties/BuyerParty/TaxIdentification/TaxIdentificationNumber",
    required: true,
    maxLength: 30,
    minLength: 3,
    helpText: "NIF/CIF de la empresa receptora",
  },
  companyEmail: {
    xmlPath: "Parties/BuyerParty/LegalEntity/ContactDetails/ElectronicMail",
    required: false,
    maxLength: 60,
  },
  companyPhone: {
    xmlPath: "Parties/BuyerParty/LegalEntity/ContactDetails/Telephone",
    required: true,
    maxLength: 15,
  },
  companyAddress: {
    xmlPath: "Parties/BuyerParty/LegalEntity/AddressInSpain/Address",
    required: true,
    maxLength: 80,
    helpText: "Dirección de la empresa receptora",
  },
  companyPostCode: {
    xmlPath: "Parties/BuyerParty/LegalEntity/AddressInSpain/PostCode",
    required: true,
    pattern: /^\d{5}$/,
    helpText: "Código postal (5 dígitos)",
  },
  companyTown: {
    xmlPath: "Parties/BuyerParty/LegalEntity/AddressInSpain/Town",
    required: true,
    maxLength: 50,
    helpText: "Población",
  },
  companyProvince: {
    xmlPath: "Parties/BuyerParty/LegalEntity/AddressInSpain/Province",
    required: true,
    maxLength: 20,
    helpText: "Provincia",
  },

  // Tax information
  vatRate: {
    xmlPath: "Invoices/Invoice/TaxesOutputs/Tax/TaxRate",
    required: true,
    helpText: "Tipo de IVA aplicado (%)",
  },
  vatTotal: {
    xmlPath: "Invoices/Invoice/TaxesOutputs/Tax/TaxAmount/TotalAmount",
    required: true,
    helpText: "Importe total de IVA",
  },
  incomeTaxRate: {
    xmlPath: "Invoices/Invoice/TaxesWithheld/Tax/TaxRate",
    required: false,
    helpText: "Porcentaje de retención de IRPF (%)",
  },
  incomeTax: {
    xmlPath: "Invoices/Invoice/TaxesWithheld/Tax/TaxAmount/TotalAmount",
    required: false,
    helpText: "Importe total de retención de IRPF",
  },

  // Invoice totals
  subtotal: {
    xmlPath: "Invoices/Invoice/InvoiceTotals/TotalGrossAmount",
    required: true,
    helpText: "Importe bruto antes de impuestos",
  },
  total: {
    xmlPath: "Invoices/Invoice/InvoiceTotals/InvoiceTotal",
    required: true,
    helpText: "Importe total de la factura",
  },

  // Payment information
  paymentBank: {
    xmlPath:
      "Invoices/Invoice/PaymentDetails/Installment/PaymentMeans/AccountToBeCredited/BIC",
    required: false,
    maxLength: 50,
    helpText: "Nombre del banco para el pago",
  },
  paymentName: {
    xmlPath:
      "Invoices/Invoice/PaymentDetails/Installment/PaymentMeans/AccountToBeCredited/AccountName",
    required: false,
    maxLength: 80,
    helpText: "Nombre del titular de la cuenta",
  },
  paymentIBAN: {
    xmlPath:
      "Invoices/Invoice/PaymentDetails/Installment/PaymentMeans/AccountToBeCredited/IBAN",
    required: false,
    pattern: /^[A-Z]{2}\d{2}[ ]?(\d{4}[ ]?){4}\d{4}[ ]?$/,
    helpText: "IBAN para el pago",
  },
  paymentSWIFT: {
    xmlPath:
      "Invoices/Invoice/PaymentDetails/Installment/PaymentMeans/AccountToBeCredited/BIC",
    required: false,
    maxLength: 11,
    helpText: "Código SWIFT/BIC del banco",
  },
};

// Default values for the invoice
export const invoiceDefaults = {
  currency: "EUR",
  country: "ESP",
  personType: "J", // J = Legal Entity, F = Individual
  residenceType: "R", // R = Resident in Spain
  invoiceDocumentType: "FC", // FC = Complete Invoice
  invoiceClass: "OO", // OO = Original Invoice
  taxTypeCode: "01", // 01 = IVA (General)
  incomeTaxTypeCode: "04", // 04 = IRPF
  paymentMeans: "04", // 04 = Bank Transfer
};
