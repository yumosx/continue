#!/usr/bin/env bash
# Install dependencies for CLI and IntelliJ IDEA plugin development.
set -e

# Check if node version matches .nvmrc
if [ -f .nvmrc ]; then
    required_node_version=$(cat .nvmrc)
    current_node_version=$(node -v)

    required_version=${required_node_version#v}
    current_version=${current_node_version#v}

    if [ "$required_version" != "$current_version" ]; then
        echo "❌ Node.js version mismatch: got $current_node_version, need $required_node_version"
        echo "Run: nvm use"
        exit 1
    fi
fi

echo "Installing root-level dependencies..."
npm install

echo "Building packages (fetch, openai-adapters, config-yaml)..."
node ./scripts/build-packages.js

echo "Installing Core dependencies..."
pushd core
export PUPPETEER_SKIP_DOWNLOAD='true'
# Skip native compile scripts (sqlite3 node-gyp); install prebuilt binary below.
npm install --ignore-scripts
popd
node ./scripts/build/install-core-native-deps.js
pushd core
npm run build
popd

echo "Installing GUI dependencies and building..."
pushd gui
npm install
NODE_OPTIONS="--max-old-space-size=4096" npm run build
popd

echo "Preparing IntelliJ plugin resources..."
node ./scripts/build/prepare-intellij.js

echo "Installing binary dependencies..."
pushd binary
npm install
npm run build
popd

echo "Installing CLI dependencies..."
pushd extensions/cli
npm install
popd

echo "Done. To run the IntelliJ plugin locally, open extensions/intellij in IntelliJ IDEA and use the Run Continue configuration."
