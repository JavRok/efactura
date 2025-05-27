import type { APIRoute } from "astro";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Enable SSR endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the HTML content from the request
    const { html } = await request.json();

    // Determine if we're running on Netlify
    const isNetlify = import.meta.env.NETLIFY === "true";
    console.log("Running on Netlify:", isNetlify, import.meta.env);

    let options;
    if (isNetlify) {
      // On Netlify, use @sparticuz/chromium
      options = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };
      console.log(
        "Using Netlify Chrome configuration with @sparticuz/chromium",
      );
    } else {
      // Local development
      const chromeExe = import.meta.env.CHROME_EXECUTABLE_PATH;
      options = {
        executablePath:
          chromeExe ||
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      };
      console.log("Using local Chrome configuration");
    }

    console.log("Chrome executable path:", options.executablePath);

    // Launch a headless browser
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "0.1cm",
        left: "1cm",
      },
    });

    // Close the browser
    await browser.close();

    // Return the PDF as a response
    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="factura.pdf"',
      },
    });
  } catch (error) {
    console.error(
      "Error generating PDF:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error),
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
