// getInvoiceListFromJson.gs
// Reads the generated listVerInvWOProc.json from project folder
// and returns the parsed array of invoice objects.
// Returns null + logs on failure.

function getInvoiceListFromJson(jsonFileName) {
  console.log("getInvoiceListFromJson: Starting...");
  console.log(`Target JSON: ${jsonFileName}`);

  if (
    !jsonFileName ||
    typeof jsonFileName !== "string" ||
    jsonFileName.trim() === ""
  ) {
    console.log("Error: Invalid JSON filename.");
    return null;
  }

  // Reuse existing helpers to get project folder & config
  const projectFolderName = getProjectFolderName();
  if (!projectFolderName) return null;

  const config = getProjectDataJson(projectFolderName);
  if (!config) return null;

  // Find project folder by name
  const folderIterator = DriveApp.getFoldersByName(projectFolderName);
  if (!folderIterator.hasNext()) {
    console.log(`Project folder "${projectFolderName}" not found.`);
    return null;
  }
  const projectFolder = folderIterator.next();

  // Find the JSON file
  const files = projectFolder.getFilesByName(jsonFileName);
  if (!files.hasNext()) {
    console.log(`JSON file "${jsonFileName}" not found in project folder.`);
    return null;
  }

  const file = files.next();
  try {
    const content = file.getBlob().getDataAsString();
    const data = JSON.parse(content);
    console.log(`Loaded ${data.length} invoices from JSON.`);
    return data;
  } catch (e) {
    console.log("Error parsing JSON: " + e.message);
    return null;
  }
}
