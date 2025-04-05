export const handleExit = () => {
  // Handle Ctrl+C gracefully
  process.on("SIGINT", () => {
    console.log("\n❌ Operation cancelled by user. Exiting...");
    process.exit(0);
  });
  
  // Handle unhandled rejections
  process.on("unhandledRejection", (error) => {
    console.error("\n❌ Unhandled promise rejection:", error);
    process.exit(1);
  });
}; 