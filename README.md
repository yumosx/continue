<h1 align="center">Continue</h1>

<p align="center">Community-maintained fork focused on the CLI</p>

<div align="center">

<a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" /></a>

</div>

## What is this?

This repository is a slimmed-down fork of [Continue](https://github.com/continuedev/continue), maintained for:

- **CLI** — terminal AI coding agent (`extensions/cli`)

The VS Code extension, JetBrains IDEA plugin, documentation site, and other unused components have been removed.

## Repository layout

```
extensions/cli/   CLI tool (@continuedev/cli)
core/             Shared TypeScript core logic
packages/         Shared npm packages (config-yaml, fetch, etc.)
config/           Config JSON schemas
scripts/          Install and build scripts
```

## Quick start

### One-shot install

```bash
./scripts/install-dependencies.sh
cd extensions/cli
npm run build
npm start
```

### Manual install

```bash
cd extensions/cli
npm install
npm run build
npm start
```

Configure models in `~/.continue/config.yaml`. See [extensions/cli/README.md](extensions/cli/README.md) for details.

## License

Apache-2.0
