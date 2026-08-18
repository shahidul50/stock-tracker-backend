import app from "./app";
import config from "./lib/config";

const PORT = config.port || 5000;

async function main() {
  try {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err: any) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

if (config.node_env !== "production") {
  main();
}