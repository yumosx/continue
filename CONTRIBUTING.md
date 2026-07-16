# Contributing

This repository is focused on the **JetBrains / IntelliJ Continue plugin**.

## Setup

1. Install Node.js (see `.nvmrc`) and JDK 17
2. Run `./scripts/install-dependencies.sh` (or `.\scripts\install-dependencies.ps1` on Windows)
3. Follow [`extensions/intellij/CONTRIBUTING.md`](extensions/intellij/CONTRIBUTING.md)

## Architecture

| Path                  | Role                              |
| --------------------- | --------------------------------- |
| `extensions/intellij` | IntelliJ platform plugin (Kotlin) |
| `core`                | Shared agent logic                |
| `binary`              | Packages core for the plugin      |
| `gui`                 | React webview UI                  |
| `packages/*`          | Shared libraries                  |

After changing the GUI, rebuild and copy into the plugin:

```bash
cd gui && npm run build && cd .. && node ./scripts/copy-gui-to-intellij.js
```

## Formatting

```bash
npm run format
```

## License

Contributions are under the Apache 2.0 license. See [CLA.md](CLA.md).
