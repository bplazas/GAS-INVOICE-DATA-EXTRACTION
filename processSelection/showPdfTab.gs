// showPdfTab.gs
// Opens a new tab with custom preview/approval page for a specific invoice.
// Pass fileId to load the right PDF thumbnail + name.

function showPdfTab(fileId) {
  console.log("===== showPdfTab started =====");
  console.log("Requested fileId: " + fileId);

  if (!fileId || typeof fileId !== "string" || fileId.trim() === "") {
    console.log("Error: Invalid fileId provided.");
    SpreadsheetApp.getUi().alert("Invalid file ID.");
    return;
  }

  // web app URL
  const webAppUrl =
    PropertiesService.getScriptProperties().getProperty("webAppUrl");
  if (!webAppUrl) {
    throw new Error("webAppUrl not found");
  }
  console.log("webAppUrl loaded");

  // Append fileId as query param
  const fullUrl = webAppUrl + "?fileId=" + encodeURIComponent(fileId);
  console.log("Opening web app URL: " + fullUrl);

  // bridge script to open tab
  const bridgeHtml = `
    <script>
      window.open('${fullUrl}', '_blank');
      google.script.host.close();
    </script>
  `;

  const htmlOutput = HtmlService.createHtmlOutput(bridgeHtml)
    .setWidth(1)
    .setHeight(1);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Opening Preview...");

  console.log("Tab open command executed for fileId: " + fileId);
}
