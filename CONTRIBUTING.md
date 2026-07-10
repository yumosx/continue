# Contributing

This repository maintains the Continue **CLI** and **JetBrains IDEA plugin** only.

## Components

| Directory             | Description                                    |
| --------------------- | ---------------------------------------------- |
| `extensions/cli`      | Terminal AI agent (`@continuedev/cli`)         |
| `extensions/intellij` | JetBrains plugin (Kotlin)                      |
| `core`                | Shared TypeScript logic                        |
| `gui`                 | React UI for the IDEA plugin                   |
| `binary`              | `continue-binary` bundled into the IDEA plugin |
| `packages/`           | Shared npm packages                            |

## Setup

```bash
./scripts/install-dependencies.sh
```

## Development guides

- CLI: see [extensions/cli/AGENTS.md](extensions/cli/AGENTS.md)
- IntelliJ plugin: see [extensions/intellij/CONTRIBUTING.md](extensions/intellij/CONTRIBUTING.md)

## Build

```bash
# CLI
cd extensions/cli && npm run build

# IDEA plugin
node scripts/build/prepare-intellij.js
cd binary && npm run build
cd extensions/intellij && ./gradlew buildPlugin
```
