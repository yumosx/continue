const fs = require("fs");

const directories = [
  // gui
  "./gui/node_modules",
  "./gui/out",
  "./gui/dist",
  // core
  "./core/node_modules",
  "./core/dist",
  // binary
  "./binary/node_modules",
  "./binary/bin",
  "./binary/dist",
  "./binary/out",
  // packages
  "./packages/config-types/node_modules",
  "./packages/config-types/dist",
  "./packages/fetch/node_modules",
  "./packages/fetch/dist",
  "./packages/llm-info/node_modules",
  "./packages/llm-info/dist",
  "./packages/config-yaml/node_modules",
  "./packages/config-yaml/dist",
  "./packages/openai-adapters/node_modules",
  "./packages/openai-adapters/dist",
  "./packages/terminal-security/node_modules",
  "./packages/terminal-security/dist",
  "./packages/continue-sdk/node_modules",
  "./packages/continue-sdk/dist",
  // intellij
  "./extensions/intellij/build",
  "./extensions/intellij/.gradle",
  // root
  "./node_modules",
];

directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  } else {
    console.log(`${dir} not found`);
  }
});
