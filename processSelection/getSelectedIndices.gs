// getSelectedIndices.gs
// Receives the array of selected indices from the modal
// and logs them in Apps Script console.
// fetch corresponding files and start processing

function getSelectedIndices(selectedIndices) {
  console.log("===== getSelectedIndices called =====");
  console.log("Received selected indices:", selectedIndices);

  if (!Array.isArray(selectedIndices) || selectedIndices.length === 0) {
    console.log("Warning: Empty or invalid indices.");
    return "No invoices selected.";
  }

  console.log(`Processing ${selectedIndices.length} selected invoice(s)`);

  // Load the full invoice list from JSON (reuse existing function)
  const jsonFileName = "listVerInvWOProc.json"; 
  const invoiceList = getInvoiceListFromJson(jsonFileName);

  if (!invoiceList || !Array.isArray(invoiceList)) {
    console.log("Error: Could not load invoice list from JSON.");
    return "Error loading invoice data.";
  }

  // Loop over selected indices and open tab for each
selectedIndices.forEach((index) => {
  const fileInfo = invoiceList[index];
  if (fileInfo && fileInfo.id) {
    console.log(
      `Opening preview for index ${index}: ${fileInfo.name} (ID: ${fileInfo.id})`,
    );
    showPdfTab(fileInfo.id);
    Utilities.sleep(4000); // 4000 ms delay to avoid broweser blocking multiple tabs opening
  }
});

  return `Opened ${selectedIndices.length} preview tabs. Review and approve.`;
}
