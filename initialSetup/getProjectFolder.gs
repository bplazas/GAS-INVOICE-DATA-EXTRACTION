// getProjectFolder.gs
// Returns the NAME (string) of the parent folder where the active spreadsheet lives.
// Throws if no parent folder found.

function getProjectFolderName() {
  console.log("getProjectFolderName: Starting...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());

  const parentIterator = spreadsheetFile.getParents();
  if (!parentIterator.hasNext()) {
    console.log("Error: No parent folder found for the active spreadsheet.");
    throw new Error("Spreadsheet has no parent folder.");
  }

  const projectFolder = parentIterator.next();
  const folderName = projectFolder.getName();

  console.log(
    `Project folder name detected: "${folderName}" (ID: ${projectFolder.getId()})`,
  );

  // Warn if multiple parents 
  if (parentIterator.hasNext()) {
    console.log(
      "Warning: Spreadsheet has multiple parent folders. Using first one.",
    );
  }

  console.log("getProjectFolderName: Done.");
  return folderName;
}
