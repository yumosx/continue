<h1 align="center">Continue (JetBrains)</h1>

<p align="center">Open-source coding agent — JetBrains / IntelliJ plugin</p>

<div align="center">

<a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" /></a>

</div>

## What is this repo?

This repository contains the **JetBrains (IntelliJ) Continue plugin** and the shared stack it needs to build and run:

| Path                  | Role                                          |
| --------------------- | --------------------------------------------- |
| `extensions/intellij` | Kotlin IntelliJ platform plugin               |
| `core`                | Shared agent / LLM / indexing logic           |
| `binary`              | Packages `core` for the plugin (stdin/stdout) |
| `gui`                 | React UI embedded in the plugin webview       |
| `packages/*`          | Shared libraries used by `core` / `gui`       |

VS Code extension, CLI, and docs site code have been removed from this fork.

## Quick start

1. Install **Node.js** (see `.nvmrc`) and **JDK 17**
2. From the repo root:

```bash
./scripts/install-dependencies.sh
```

3. Open `extensions/intellij` in IntelliJ IDEA and run the **Run Continue** configuration

See [`extensions/intellij/CONTRIBUTING.md`](extensions/intellij/CONTRIBUTING.md) for development details.

## License

Apache 2.0 © 2023-2026 Continue Dev, Inc.
