# Contributing

This repository maintains the Continue **CLI** only.

## Components

| Directory        | Description                            |
| ---------------- | -------------------------------------- |
| `extensions/cli` | Terminal AI agent (`@continuedev/cli`) |
| `core`           | Shared TypeScript logic                |
| `packages/`      | Shared npm packages                    |

## Setup

```bash
./scripts/install-dependencies.sh
```

## Development

See [extensions/cli/AGENTS.md](extensions/cli/AGENTS.md).

## Build

```bash
cd extensions/cli && npm run build
```

## License

Apache-2.0
