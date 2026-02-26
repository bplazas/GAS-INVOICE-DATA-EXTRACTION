// getProjectDataJson.gs
// Locates projectData.json in the given project folder (by name),
// reads it, parses JSON, and returns the config object.
// Returns early with null + logs if anything fails.

function getProjectDataJson(projectFolderName) {
  console.log("getProjectDataJson: Starting...");
  console.log(`Looking in project folder: "${projectFolderName}"`);

  if (
    !projectFolderName ||
    typeof projectFolderName !== "string" ||
    projectFolderName.trim() === ""
  ) {
    console.log("Error: Invalid project folder name provided.");
    return null;
  }

  // Find project folder by name
  const folderIterator = DriveApp.getFoldersByName(projectFolderName);
  if (!folderIterator.hasNext()) {
    console.log(`Error: Project folder "${projectFolderName}" not found.`);
    return null;
  }
  const projectFolder = folderIterator.next();
  console.log(
    `Found project folder: "${projectFolder.getName()}" (ID: ${projectFolder.getId()})`,
  );

  // Look for config file
  const configFileName = "projectData.json";
  const configFiles = projectFolder.getFilesByName(configFileName);
  if (!configFiles.hasNext()) {
    console.log(
      `Error: ${configFileName} not found in "${projectFolderName}".`,
    );
    return null;
  }

  const configFile = configFiles.next();
  console.log(
    `Found config: ${configFile.getName()} (${configFile.getSize()} bytes)`,
  );

  // Parse
  try {
    const jsonString = configFile.getBlob().getDataAsString();
    const config = JSON.parse(jsonString);
    console.log("projectData.json parsed successfully.");
    return config;
  } catch (error) {
    console.log(`Error parsing projectData.json: ${error.message}`);
    return null;
  }
}
