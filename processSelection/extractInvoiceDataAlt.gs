// extractInvoiceDataAlt.gs
// used during development only - do not use
// Dummy function - emulates json result from gemini AI w/o using the API 
// Standalone test: extracts key data from editable PDF using Gemini AI.
// Uses text from blob → prompt → JSON output.
// Logs everything for debug.

function extractInvoiceDataAlt(fileId) {
  console.log("===== extract Invoice Data started =====");
  console.log("Processing fileId: " + fileId);

  try {
    // Step 1: Find file
    console.log("Step 1: Getting file...");
    const file = DriveApp.getFileById(fileId);
    const fileName = file.getName();
    console.log(`File: ${fileName} (Size: ${file.getSize()} bytes)`);

    // Step 2: Get text from editable PDF
    console.log("Getting Blod from pdf");
    const blob = file.getBlob();

    // Step 3: Gemini prompt + JSON schema
    console.log("Preparing Gemini prompt...");
    const prompt = `
        You are an expert in Colombian DIAN electronic invoices (factura electrónica de venta).

        Analyze the attached PDF file and extract ALL these fields as JSON.
        Return ONLY valid JSON, no explanations, no markdown, no extra text.

        Required fields:
        - nitEmisor: NIT of the seller/issuer (format like "860503159-1" or "901.334.302")
        - nitReceptor: NIT of the buyer/customer
        - numeroFactura: invoice number (e.g. "50363484")
        - fechaExpedicion: issue date (YYYY-MM-DD)
        - fechaVencimiento: due date if present (YYYY-MM-DD or null)
        - subtotal: subtotal before tax (clean number, dot for decimal, no thousand separators)
        - iva: IVA amount (number)
        - total: grand total (number)

        Be extremely precise:
        - Remove thousand separators (e.g. "2,056,877.35" → 2056877.35)
        - Use dot for decimals
        - Look at top section, tables, bottom totals
        - If missing or unclear, use null

        PDF file attached below.
        `;

    // Step 4: Call Gemini Generative Language API (new correct endpoint)
    console.log("Calling Gemini Generative Language API... dummy alternative");

    extractedJson = {
      nitEmisor: "111.111.111-1",
      nitReceptor: "222.222.222-1",
      numeroFactura: "999999",
      fechaExpedicion: "1900-01-01",
      fechaVencimiento: "1900-01-01",
      subtotal: 1000000,
      iva: 119000,
      total: 1119000,
    };

    console.log("===== testExtractWAi finished =====");
    return extractedJson;
  } catch (e) {
    console.log("ERROR:", e.message);
    return null;
  }
}
