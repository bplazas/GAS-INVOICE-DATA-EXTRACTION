// listVerInvWOProc.gs
// Scans the specified invoices folder (inside project folder), builds a summary JSON,
// and saves it as a file in the project root folder.
// Does NOT return anything — side effect is the saved JSON file.
// Logs every step for easy debugging.

function listVerInvWOProc(
  projectFolderName,
  verInvWOProcFolderName,
  outputJsonFileName,
) {
  console.log("===== Starting listVerInvWOProc =====");
  console.log(`Arguments received:`);
  console.log(`  projectFolderName     : ${projectFolderName}`);
  console.log(`  verInvWOProcFolderName: ${verInvWOProcFolderName}`);
  console.log(`  outputJsonFileName    : ${outputJsonFileName}`);

  // 1. Validate inputs
  if (
    !projectFolderName ||
    typeof projectFolderName !== "string" ||
    projectFolderName.trim() === ""
  ) {
    console.log("Error: projectFolderName must be a non-empty string.");
    throw new Error("Invalid project folder name.");
  }
  if (
    !verInvWOProcFolderName ||
    typeof verInvWOProcFolderName !== "string" ||
    verInvWOProcFolderName.trim() === ""
  ) {
    console.log("Error: verInvWOProcFolderName must be a non-empty string.");
    throw new Error("Invalid invoices folder name.");
  }
  if (
    !outputJsonFileName ||
    typeof outputJsonFileName !== "string" ||
    outputJsonFileName.trim() === ""
  ) {
    console.log("Error: outputJsonFileName must be a non-empty string.");
    throw new Error("Invalid output JSON filename.");
  }

  // 2. Find the project root folder by name
  console.log(`Locating project folder: "${projectFolderName}"`);
  const projectFolderIterator = DriveApp.getFoldersByName(projectFolderName);
  if (!projectFolderIterator.hasNext()) {
    console.log(`Error: Project folder "${projectFolderName}" not found.`);
    throw new Error(`Project folder "${projectFolderName}" not found.`);
  }
  const projectFolder = projectFolderIterator.next();
  console.log(
    `Project folder found: "${projectFolder.getName()}" (ID: ${projectFolder.getId()})`,
  );

  if (projectFolderIterator.hasNext()) {
    console.log(
      "Warning: Multiple folders with project name exist. Using first one found.",
    );
  }

  // 3. Find the invoices folder inside the project folder (by name)
  console.log(
    `Searching for invoices folder: "${verInvWOProcFolderName}" inside project folder`,
  );
  const invoicesFolderIterator = projectFolder.getFoldersByName(
    verInvWOProcFolderName,
  );
  if (!invoicesFolderIterator.hasNext()) {
    console.log(
      `Error: Invoices folder "${verInvWOProcFolderName}" not found inside "${projectFolderName}".`,
    );
    throw new Error(`Invoices folder not found.`);
  }
  const invoicesFolder = invoicesFolderIterator.next();
  console.log(
    `Invoices folder found: "${invoicesFolder.getName()}" (ID: ${invoicesFolder.getId()})`,
  );

  // 4. Collect file summary
  const fileSummary = [];
  const fileIterator = invoicesFolder.getFiles();

  console.log("Scanning files in invoices folder...");
  while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    console.log(`  → Found: ${file.getName()} (${file.getSize()} bytes)`);

    fileSummary.push({
      id: file.getId(),
      name: file.getName(),
      dateCreated: file.getDateCreated().toISOString(),
      sizeBytes: file.getSize(),
    });
  }

  // 5. Generate JSON
  const jsonContent = JSON.stringify(fileSummary, null, 2);
  console.log("Generated JSON content:");
  console.log(jsonContent);

  // 6. Save (or overwrite) the JSON file in project root
  console.log(`Saving JSON to: "${outputJsonFileName}" in project folder`);
  const existingFiles = projectFolder.getFilesByName(outputJsonFileName);

  if (existingFiles.hasNext()) {
    const existingFile = existingFiles.next();
    existingFile.setContent(jsonContent);
    console.log(`Overwrote existing file "${outputJsonFileName}"`);
    // Clean up any duplicate files 
    while (existingFiles.hasNext()) {
      existingFiles.next().setTrashed(true);
      console.log("Trashed duplicate old JSON file.");
    }
  } else {
    projectFolder.createFile(
      outputJsonFileName,
      jsonContent,
      MimeType.PLAIN_TEXT,
    );
    console.log(`Created new file "${outputJsonFileName}"`);
  }

  console.log(`Completed: ${fileSummary.length} files summarized and saved.`);

  // Return fresh array 
  return fileSummary;

  console.log("===== listVerInvWOProc finished =====");
}
