# Continue IntelliJ plugin local build helpers
#
# After changing core/config/default.ts (or other core code):
#   make rebuild
#
# First-time / full local package:
#   make install && make build
#
# Output zip:
#   extensions/intellij/build/distributions/*.zip

SHELL := /bin/bash
.DEFAULT_GOAL := help

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
INTLJJ := $(ROOT)/extensions/intellij
GRADLEW := ./gradlew

# Host target for binary packaging (override: make binary TARGET=linux-x64)
UNAME_S := $(shell uname -s)
UNAME_M := $(shell uname -m)
ifeq ($(UNAME_S),Darwin)
  ifeq ($(UNAME_M),arm64)
    HOST_TARGET := darwin-arm64
  else
    HOST_TARGET := darwin-x64
  endif
else ifeq ($(UNAME_S),Linux)
  ifeq ($(UNAME_M),aarch64)
    HOST_TARGET := linux-arm64
  else
    HOST_TARGET := linux-x64
  endif
else
  HOST_TARGET := win32-x64
endif

TARGET ?= $(HOST_TARGET)

.PHONY: help install packages gui gui-copy binary binary-all binary-fast \
	plugin rebuild build run clean dist-path

help: ## Show available targets
	@echo "Host binary target: $(HOST_TARGET)"
	@echo ""
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install deps (root/core/gui/binary) and do an initial build
	./scripts/install-dependencies.sh

packages: ## Build shared packages (config-yaml, openai-adapters, fetch, ...)
	node ./scripts/build-packages.js

gui: ## Build GUI and copy into IntelliJ webview resources
	cd gui && NODE_OPTIONS="--max-old-space-size=4096" npm run build
	$(MAKE) gui-copy

gui-copy: ## Copy existing GUI dist into IntelliJ plugin
	node ./scripts/copy-gui-to-intellij.js

binary: ## Build continue-binary for TARGET (default: host)
	cd binary && npm run build -- --target $(TARGET)

binary-all: ## Build continue-binary for all platforms
	cd binary && npm run build

binary-fast: ## Esbuild-only core rebuild (dev; does not re-pkg binary)
	cd binary && npm run rebuild

plugin: ## Package IntelliJ plugin zip
	cd $(INTLJJ) && $(GRADLEW) buildPlugin

rebuild: binary plugin ## Rebuild after core/config changes (recommended)
	@echo ""
	@echo "Done. Plugin zip:"
	@$(MAKE) --no-print-directory dist-path
	@echo ""
	@echo "Note: existing ~/.continue/config.yaml is NOT overwritten."
	@echo "Delete it (or edit models) if you want the new default model."

build: packages gui binary plugin ## Full local build (gui + binary + plugin)
	@echo ""
	@echo "Done. Plugin zip:"
	@$(MAKE) --no-print-directory dist-path

run: ## Launch IDE with plugin (Gradle runIde)
	cd $(INTLJJ) && $(GRADLEW) runIde

clean: ## Clean binary/gui/intellij build outputs
	cd binary && rm -rf bin out build tmp tree-sitter
	cd gui && rm -rf dist
	cd $(INTLJJ) && $(GRADLEW) clean

dist-path: ## Print built plugin zip path(s)
	@ls -1 $(INTLJJ)/build/distributions/*.zip 2>/dev/null || \
		echo "(no zip yet — run: make rebuild)"
