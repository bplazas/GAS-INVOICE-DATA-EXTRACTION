// showSelectModal.gs
// Show modal on spreadsheet to select invoices to process

function showSelectModal(jsonFileName) {
  console.log("showSelectModal: Starting...");
  console.log(`Using JSON file: ${jsonFileName}`);

  if (
    !jsonFileName ||
    typeof jsonFileName !== "string" ||
    jsonFileName.trim() === ""
  ) {
    console.log("Error: Invalid JSON filename.");
    SpreadsheetApp.getUi().alert(
      "Configuration error: Missing JSON file name.",
    );
    return;
  }

  const htmlTemplate = HtmlService.createTemplateFromFile("selectModal");

  // Pass the json filename to client-side (for google.script.run)
  htmlTemplate.jsonFileName = jsonFileName;

  const htmlOutput = htmlTemplate
    .evaluate()
    .setWidth(700) // slightly wider for table
    .setHeight(550);

  SpreadsheetApp.getUi().showModalDialog(
    htmlOutput,
    "Select Invoices to Process",
  );

  console.log("showSelectModal: Modal displayed.");
}
