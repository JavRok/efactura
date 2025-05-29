import type { APIRoute } from "astro";
import {
  generateFacturaeXML,
  validateInvoiceData,
} from "../../lib/facturae/xmlGenerator";
import type { InvoiceData } from "../../stores/invoiceStore";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the request body
    const requestData = await request.json();
    const invoiceData: InvoiceData = requestData.invoice || requestData;

    // Validate the invoice data
    const validation = validateInvoiceData(invoiceData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: validation.errors,
          error: "Datos de factura inválidos: " + validation.errors.join(", "),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Generate the XML
    const xml = generateFacturaeXML(invoiceData);
    
    // Determine filename
    const filename = `factura_${invoiceData.invoiceNumber || 'export'}.xml`;

    // Return the XML as a downloadable file
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating XML:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error generating XML",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
