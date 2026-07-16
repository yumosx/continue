/**
 * Copy gui/dist into the IntelliJ plugin webview resources.
 * Preserves the JetBrains-specific index.html (sets localStorage ide=jetbrains).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const guiDist = path.join(root, "gui", "dist");
const webviewPath = path.join(
  root,
  "extensions",
  "intellij",
  "src",
  "main",
  "resources",
  "webview",
);

function main() {
  if (!fs.existsSync(guiDist)) {
    throw new Error(
      `gui/dist not found at ${guiDist}. Run "npm run build" in gui/ first.`,
    );
  }

  const indexHtmlPath = path.join(webviewPath, "index.html");
  const tmpIndex = path.join(root, "gui", "tmp_index.html");

  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`JetBrains webview index.html missing at ${indexHtmlPath}`);
  }

  fs.copyFileSync(indexHtmlPath, tmpIndex);
  fs.rmSync(webviewPath, { recursive: true, force: true });
  fs.mkdirSync(webviewPath, { recursive: true });
  fs.cpSync(guiDist, webviewPath, { recursive: true });

  // Restore JetBrains-specific index.html (do not use Vite's index.html)
  fs.copyFileSync(tmpIndex, indexHtmlPath);
  fs.unlinkSync(tmpIndex);

  console.log("[info] Copied gui/dist to IntelliJ webview resources");
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
