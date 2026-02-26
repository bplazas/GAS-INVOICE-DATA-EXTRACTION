// extractInvoiceData.gs
// extracts key data from editable PDF using Gemini AI.
// Uses text from blob → prompt → JSON output.
// Logs everything for debug.

function extractInvoiceData(fileId) {
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
    // prompt final optimized final version
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
    console.log("Calling Gemini Generative Language API...");

    const apiKey =
      PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }
    console.log("Gemini API key loaded");

    const model = "gemini-2.5-flash";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "application/pdf",
                data: Utilities.base64Encode(blob.getBytes()),
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    console.log("Gemini raw response:", JSON.stringify(json, null, 2));

    // Extract generated text
    let generatedText = "";
    if (json.candidates && json.candidates.length > 0) {
      generatedText = json.candidates[0].content.parts[0].text.trim();
      console.log("Generated text:", generatedText);
    } else {
      console.log("No candidates returned. Full response:", json);
      throw new Error("No response from Gemini.");
    }

    // Clean and parse JSON
    let extractedJson;
    try {
      let cleanText = generatedText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
      extractedJson = JSON.parse(cleanText);
      console.log("Parsed JSON:", JSON.stringify(extractedJson, null, 2));
    } catch (parseErr) {
      console.log("JSON parse error:", parseErr.message);
      console.log("Raw generated text (fallback):", generatedText);
    }

    console.log("===== testExtractWAi finished =====");
    return extractedJson;
  } catch (e) {
    console.log("ERROR:", e.message);
    return null;
  }
}
