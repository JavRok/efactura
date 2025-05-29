import type { InvoiceData, InvoiceLine } from "../../stores/invoiceStore";
import { invoiceDefaults } from "./mappingRules";

export function generateFacturaeXML(invoice: InvoiceData): string {
  // Format date as YYYY-MM-DD
  // TODO: Transform Dates
  const invoiceDate = invoice.invoiceDate.split("/").reverse().join("-");
  const paymentDue = invoice.paymentDue.split("/").reverse().join("-");

  const batchNumber = invoice.fiscalNumber + invoice.invoiceNumber;

  // NOTE: When buyer is not in Spain, this needs ES prefix
  const taxIdentificationNumber = invoice.myFiscalNumber;

  // Create XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<fe:Facturae xmlns:fe="http://www.facturae.es/Facturae/2014/v3.2.2/Facturae">
  <FileHeader>
    <SchemaVersion>3.2.2</SchemaVersion>
    <Modality>I</Modality>
    <InvoiceIssuerType>EM</InvoiceIssuerType>
    <Batch>
      <BatchIdentifier>${batchNumber}</BatchIdentifier>
      <InvoicesCount>1</InvoicesCount>
      <TotalInvoicesAmount>
        <TotalAmount>${invoice.total.toFixed(2)}</TotalAmount>
      </TotalInvoicesAmount>
      <TotalOutstandingAmount>
        <TotalAmount>${invoice.total.toFixed(2)}</TotalAmount>
      </TotalOutstandingAmount>
      <TotalExecutableAmount>
        <TotalAmount>${invoice.total.toFixed(2)}</TotalAmount>
      </TotalExecutableAmount>
      <InvoiceCurrencyCode>${invoiceDefaults.currency}</InvoiceCurrencyCode>
    </Batch>
  </FileHeader>
  <Parties>
    <SellerParty>
      <TaxIdentification>
        <PersonTypeCode>${invoiceDefaults.personType}</PersonTypeCode>
        <ResidenceTypeCode>${invoiceDefaults.residenceType}</ResidenceTypeCode>
        <TaxIdentificationNumber>${taxIdentificationNumber}</TaxIdentificationNumber>
      </TaxIdentification>
      <LegalEntity>
        <CorporateName>${invoice.myCompanyName}</CorporateName>
        <AddressInSpain>
          <Address>${invoice.myCompanyAddress}</Address>
          <PostCode>${invoice.myCompanyPostcode}</PostCode>
          <Town>${invoice.myCompanyTown}</Town>
          <Province>${invoice.myCompanyProvince}</Province>
          <CountryCode>${invoiceDefaults.country}</CountryCode>
        </AddressInSpain>
      </LegalEntity>
    </SellerParty>
    <BuyerParty>
      <TaxIdentification>
        <PersonTypeCode>${invoiceDefaults.personType}</PersonTypeCode>
        <ResidenceTypeCode>${invoiceDefaults.residenceType}</ResidenceTypeCode>
        <TaxIdentificationNumber>${invoice.fiscalNumber}</TaxIdentificationNumber>
      </TaxIdentification>
      <LegalEntity>
        <CorporateName>${invoice.companyName}</CorporateName>
        <AddressInSpain>
          <Address>${invoice.companyAddress}</Address>
          <PostCode>${invoice.companyPostcode || "08001"}</PostCode>
          <Town>${invoice.companyTown || "Barcelona"}</Town>
          <Province>${invoice.companyProvince || "Barcelona"}</Province>
          <CountryCode>${invoiceDefaults.country}</CountryCode>
        </AddressInSpain>
      </LegalEntity>
    </BuyerParty>
  </Parties>
  <Invoices>
    <Invoice>
      <InvoiceHeader>
        <InvoiceNumber>${invoice.invoiceNumber}</InvoiceNumber>
        <InvoiceDocumentType>${invoiceDefaults.invoiceDocumentType}</InvoiceDocumentType>
        <InvoiceClass>${invoiceDefaults.invoiceClass}</InvoiceClass>
      </InvoiceHeader>
      <InvoiceIssueData>
        <IssueDate>${invoiceDate}</IssueDate>
        <InvoiceCurrencyCode>${invoiceDefaults.currency}</InvoiceCurrencyCode>
        <TaxCurrencyCode>${invoiceDefaults.currency}</TaxCurrencyCode>
      </InvoiceIssueData>
      <TaxesOutputs>
        <Tax>
          <TaxTypeCode>${invoiceDefaults.taxTypeCode}</TaxTypeCode>
          <TaxRate>${invoice.vatRate}.00</TaxRate>
          <TaxableBase>
            <TotalAmount>${invoice.subtotal.toFixed(2)}</TotalAmount>
          </TaxableBase>
          <TaxAmount>
            <TotalAmount>${invoice.vatTotal.toFixed(2)}</TotalAmount>
          </TaxAmount>
        </Tax>
      </TaxesOutputs>
      <TaxesWithheld>
        <Tax>
          <TaxTypeCode>${invoiceDefaults.incomeTaxTypeCode}</TaxTypeCode>
          <TaxRate>${invoice.incomeTaxRate}.00</TaxRate>
          <TaxableBase>
            <TotalAmount>${invoice.subtotal.toFixed(2)}</TotalAmount>
          </TaxableBase>
          <TaxAmount>
            <TotalAmount>${Math.abs(invoice.incomeTax).toFixed(2)}</TotalAmount>
          </TaxAmount>
        </Tax>
      </TaxesWithheld>
      <InvoiceTotals>
        <TotalGrossAmount>${invoice.subtotal.toFixed(2)}</TotalGrossAmount>
        <TotalGeneralDiscounts>0.00</TotalGeneralDiscounts>
        <TotalGeneralSurcharges>0.00</TotalGeneralSurcharges>
        <TotalGrossAmountBeforeTaxes>${invoice.subtotal.toFixed(2)}</TotalGrossAmountBeforeTaxes>
        <TotalTaxOutputs>${invoice.vatTotal.toFixed(2)}</TotalTaxOutputs>
        <TotalTaxesWithheld>${Math.abs(invoice.incomeTax).toFixed(2)}</TotalTaxesWithheld>
        <InvoiceTotal>${invoice.total.toFixed(2)}</InvoiceTotal>
        <TotalOutstandingAmount>${invoice.total.toFixed(2)}</TotalOutstandingAmount>
        <TotalExecutableAmount>${invoice.total.toFixed(2)}</TotalExecutableAmount>
      </InvoiceTotals>
      <Items>${generateInvoiceItems(invoice.invoiceLines, invoice.vatRate)}
      </Items>
      <PaymentDetails>
        <Installment>
            <InstallmentDueDate>${paymentDue}</InstallmentDueDate>
            <InstallmentAmount>${invoice.total.toFixed(2)}</InstallmentAmount>
            <PaymentMeans>${invoiceDefaults.paymentMeans}</PaymentMeans>
            <AccountToBeCredited>
                <IBAN>${invoice.paymentIBAN}</IBAN>
                <BIC>${invoice.paymentSWIFT}</BIC>
            </AccountToBeCredited>
            <PaymentReconciliationReference>${invoice.invoiceNumber}</PaymentReconciliationReference>
        </Installment>
      </PaymentDetails>
    </Invoice>
  </Invoices>
</fe:Facturae>`;

  return xml;
}

function generateInvoiceItems(lines: InvoiceLine[], vatRate: number): string {
  return lines
    .map((line, index) => {
      const tax = line.totalPrice * (vatRate / 100);
      return `
          <InvoiceLine>
            <ItemDescription>${line.detail}</ItemDescription>
            <Quantity>${line.quantity}</Quantity>
            <UnitPriceWithoutTax>${line.unitPrice.toFixed(2)}</UnitPriceWithoutTax>
            <TotalCost>${line.totalPrice.toFixed(2)}</TotalCost>
            <GrossAmount>${line.totalPrice.toFixed(2)}</GrossAmount>
            <TaxesOutputs>
              <Tax>
                <TaxTypeCode>${invoiceDefaults.taxTypeCode}</TaxTypeCode>
                <TaxRate>${vatRate}.00</TaxRate>
                <TaxableBase>
                  <TotalAmount>${line.totalPrice.toFixed(2)}</TotalAmount>
                </TaxableBase>
                <TaxAmount>
                  <TotalAmount>${tax.toFixed(2)}</TotalAmount>
                </TaxAmount>
              </Tax>
            </TaxesOutputs>            
          </InvoiceLine>`;
    })
    .join("");
}

// Function to validate invoice data against mapping rules
export function validateInvoiceData(invoice: InvoiceData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!invoice.invoiceNumber) {
    errors.push("El número de factura es obligatorio");
  }

  if (!invoice.myCompanyName) {
    errors.push("El nombre de la empresa emisora es obligatorio");
  }

  if (!invoice.companyName) {
    errors.push("El nombre de la empresa receptora es obligatorio");
  }

  if (invoice.invoiceLines.length === 0) {
    errors.push("La factura debe tener al menos una línea");
  }

  // Check VAT format
  const vatPattern = /^[A-Z0-9]+$/;
  if (invoice.myCompanyVat && !vatPattern.test(invoice.myCompanyVat)) {
    errors.push("El NIF/CIF de la empresa emisora no tiene un formato válido");
  }

  if (invoice.companyVat && !vatPattern.test(invoice.companyVat)) {
    errors.push(
      "El NIF/CIF de la empresa receptora no tiene un formato válido",
    );
  }

  // Check postal code format
  const postalCodePattern = /^\d{5}$/;
  if (
    invoice.myCompanyPostCode &&
    !postalCodePattern.test(invoice.myCompanyPostCode)
  ) {
    errors.push("El código postal de la empresa emisora debe tener 5 dígitos");
  }

  if (
    invoice.companyPostCode &&
    !postalCodePattern.test(invoice.companyPostCode)
  ) {
    errors.push(
      "El código postal de la empresa receptora debe tener 5 dígitos",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Function to download the XML file
export function downloadXML(xml: string, filename: string): void {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "factura.xml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
