// main.gs
// Main entry point: orchestrates config loading and invoice listing.
// Keeps heavy logic in separate single-responsibility functions.
function main() {

  console.log("===== main() started ====="); // Get project folder name
  
  const projectFolderName = getProjectFolderName(); // Load parsed config from projectData.json
  
  const config = getProjectDataJson(projectFolderName); // Delegate to the listing function
  
  console.log("main: Delegating to listVerInvWOProc...");
  listVerInvWOProc(
    config.projectFolder,
    config.verInvWOProcFolder,
    config.verInvWOProcJson,
  ); // After list is generated → show modal for user selection
  
  console.log("main: Showing invoice selection modal...");
  showSelectModal(config.verInvWOProcJson);
  
  console.log("===== main() finished =====");
}
