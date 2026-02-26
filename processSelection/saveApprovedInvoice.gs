// save.gs
// Purpose: Receives the approved/edited invoice data from the HTML preview
//          and appends it as a new row in the "INVOICES" sheet

/**
 * Saves the approved invoice data to the INVOICES sheet.
 * Called from client-side via google.script.run
 *
 * @param {Object} formData - The collected and possibly edited data from the preview
 * @param {string} formData.GoogleId      - Drive file ID
 * @param {string} formData.fileName      - Original filename
 * @param {string} formData.nitEmisor
 * @param {string} formData.nitReceptor
 * @param {string} formData.numeroFactura
 * @param {string} formData.fechaExpedicion
 * @param {string} formData.fechaVencimiento
 * @param {string} formData.subtotal
 * @param {string} formData.iva
 * @param {string} formData.total
 */
function saveApprovedInvoice(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("INVOICES");

    if (!sheet) {
      throw new Error('Sheet "INVOICES" not found in the active spreadsheet.');
    }

    // Find the next empty row (looking at column A - No. Consecutivo)
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;

    // Calculate consecutive number: last used number + 1
    // If no data yet (only headers), start with 1
    let consecutivo = 1;
    if (lastRow >= 2) {
      // at least one data row exists
      const lastConsecutivo = sheet.getRange(lastRow, 1).getValue(); // Column A
      if (typeof lastConsecutivo === "number" && !isNaN(lastConsecutivo)) {
        consecutivo = Number(lastConsecutivo) + 1;
      }
    }

    // Prepare the row data in the exact column order
    const rowData = [
      consecutivo, // A - No. Consecutivo receptor
      formData.GoogleId, // B - Google ID
      formData.fileName, // C - Nombre Archivo
      formData.nitEmisor, // D - Nit Emisor
      formData.nitReceptor, // E - Nit Receptor
      formData.numeroFactura, // F - Número Factura del Emisor
      formData.fechaExpedicion, // G - Fecha Expedicion
      formData.fechaVencimiento, // H - Fecha Vencimiento
      formData.subtotal, // I - SubTotal
      formData.iva, // J - IVA
      formData.total, // K - Total
    ];

    // Write the row
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);

    // success logging (visible in Executions log)
    console.log(
      `Invoice saved successfully - Row ${nextRow} | Consecutivo: ${consecutivo} | File: ${formData.fileName}`,
    );

    return {
      success: true,
      message: `Factura guardada correctamente (Consecutivo: ${consecutivo})`,
      row: nextRow,
    };
  } catch (error) {
    console.error("Error saving invoice:", error);
    return {
      success: false,
      message: "Error al guardar: " + (error.message || "Unknown error"),
    };
  }
}
