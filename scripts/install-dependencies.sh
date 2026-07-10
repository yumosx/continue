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
        echo "⚠️  Warning: Your Node.js version ($current_node_version) does not match the required version ($required_node_version)"
        echo "Please consider switching to the correct version using: nvm use"

        if [ -t 0 ]; then
            read -p "Press Enter to continue with installation anyway..."
        else
            echo "Continuing with installation anyway..."
        fi
        echo
    fi
fi

echo "Installing root-level dependencies..."
npm install

# sharp is pulled in by @xenova/transformers (core). Default libvips download is from GitHub
# and often times out; npmmirror works reliably in CN networks.
export npm_config_sharp_libvips_binary_host="${npm_config_sharp_libvips_binary_host:-https://npmmirror.com/mirrors/sharp-libvips}"
export npm_config_sharp_binary_host="${npm_config_sharp_binary_host:-https://npmmirror.com/mirrors/sharp}"

echo "Building packages (fetch, openai-adapters, config-yaml)..."
node ./scripts/build-packages.js

echo "Installing Core dependencies..."
pushd core
export PUPPETEER_SKIP_DOWNLOAD='true'
npm install
npm link
npm run build
popd

echo "Installing GUI dependencies and building..."
pushd gui
npm install
npm link @continuedev/core
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
