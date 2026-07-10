const fs = require("fs");

const directories = [
  "./gui/node_modules",
  "./gui/out",
  "./gui/dist",
  "./core/node_modules",
  "./core/dist",
  "./binary/node_modules",
  "./binary/bin",
  "./binary/dist",
  "./binary/out",
  "./extensions/cli/node_modules",
  "./extensions/cli/dist",
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
  "./node_modules",
];

directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
    console.log(`Removed ${dir}`);
  } else {
    console.log(`${dir} not found`);
  }
});
