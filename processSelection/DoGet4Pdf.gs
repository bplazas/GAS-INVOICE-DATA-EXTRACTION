// doGet function
// function responsible for rendering the HTML tab w PDF big Thumbnail + data extracted


function doGet(e) {
  const fileId = e.parameter.fileId; // fallback for test
  console.log("doGet including AI extraction called with fileId: " + fileId);

  try {
    const file = DriveApp.getFileById(fileId);
    const fileName = file.getName();
    let thumbnailUrl = "";

    // Get large thumbnail via Drive API
    const metadata = Drive.Files.get(fileId, { fields: "thumbnailLink" });
    if (metadata.thumbnailLink) {
      thumbnailUrl = metadata.thumbnailLink.replace(/=s\d+$/, "=s1200");
    }

    console.log("creating html template");
    const template = HtmlService.createTemplateFromFile("showPdf");
    template.fileName = fileName;
    template.fileId = fileId;
    template.thumbnailUrl = thumbnailUrl;
    console.log("html template created");

    console.log("Extracting invoice data with Gemini... on doGet");
    console.log("this is fileId ", fileId, " calling extractInvoiceData... ");
    const extractedData = extractInvoiceData(fileId);

    template.extractedData = extractedData || { error: "Extraction failed" };

    return template
      .evaluate()
      .setTitle("Invoice Preview: " + fileName + fileId)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); 
  } catch (err) {
    console.log("doGet error: " + err.message);
    return HtmlService.createHtmlOutput("<h1>Error: " + err.message + "</h1>");
  }
}
