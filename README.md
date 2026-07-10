<h1 align="center">Continue</h1>

<p align="center">Community-maintained fork focused on CLI and JetBrains IDEA plugin</p>

<div align="center">

<a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" /></a>

</div>

## What is this?

This repository is a slimmed-down fork of [Continue](https://github.com/continuedev/continue), maintained for:

- **CLI** — terminal AI coding agent (`extensions/cli`)
- **JetBrains IDEA plugin** — IntelliJ / PyCharm / WebStorm integration (`extensions/intellij`)

The VS Code extension, documentation site, and other unused components have been removed.

## Repository layout

```
extensions/cli/       CLI tool (@continuedev/cli)
extensions/intellij/  JetBrains plugin (Kotlin)
core/                 Shared TypeScript core logic
gui/                  React UI embedded in the IDEA plugin
binary/               continue-binary packaged into the IDEA plugin
packages/             Shared npm packages (config-yaml, fetch, etc.)
config/               Config JSON schemas for the IDEA plugin
scripts/build/        Build scripts for IDEA plugin packaging
```

## Quick start

### CLI

```bash
cd extensions/cli
npm install
npm run build
npm start
```

### IntelliJ plugin (development)

Requirements: Node.js 20+, JDK 17, IntelliJ IDEA

```bash
./scripts/install-dependencies.sh
```

Then open `extensions/intellij` in IntelliJ IDEA and run the **Run Continue** configuration. See [extensions/intellij/CONTRIBUTING.md](extensions/intellij/CONTRIBUTING.md) for details.

### Build IDEA plugin (production)

```bash
./scripts/install-dependencies.sh
cd extensions/intellij
./gradlew buildPlugin
```

Output: `extensions/intellij/build/distributions/continue-intellij-extension-*.zip`

## License

Apache-2.0
