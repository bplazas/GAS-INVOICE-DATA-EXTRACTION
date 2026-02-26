// function created for testing only - do not use

function testSelectionFlow() {
  const selectedIndices = [0, 1, 2]; // simulate user selected first 3
  console.log("Simulating selected indices: " + selectedIndices);

  // Assume you have invoiceList from JSON (hardcode for test)
  const mockInvoiceList = [
    { id: "1WxaZax4UHrmXNziS8qRnQ7yQKaRojldi" },
    { id: "1O9MC980qCQSy6lURZHRdy_QEZNZ9A8Fx" },
  ];

  console.log("calling showPdfTab with index 0");

  showPdfTab(mockInvoiceList[0].id);

  console.log("sleep 2000");

  Utilities.sleep(4000);

  console.log("calling showPdfTab with index 1");

  showPdfTab(mockInvoiceList[1].id);

  console.log("all tabs called");

}
