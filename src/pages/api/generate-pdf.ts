import type { APIRoute } from 'astro';
import puppeteer from 'puppeteer';

// Enable SSR endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the HTML content from the request
    const { html } = await request.json();

    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    // Close the browser
    await browser.close();

    // Return the PDF as a response
    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="factura.pdf"'
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
