# Install dependencies for CLI and IntelliJ IDEA plugin development.
set -e

Write-Host "`nChecking for dependencies that may require manual installation...`n" -ForegroundColor White

$node = (get-command node -ErrorAction SilentlyContinue)
if ($null -eq $node) {
    Write-Host "Not Found " -ForegroundColor Red -NoNewLine
    Write-Host "node"
} else {
    Write-Host "Found " -ForegroundColor Green -NoNewLine
    Write-Host "node " -NoNewLine
    & node --version
}

if (Test-Path ".nvmrc") {
    $requiredNodeVersion = Get-Content ".nvmrc"
    $currentNodeVersion = node -v

    $requiredVersion = $requiredNodeVersion.TrimStart('v')
    $currentVersion = $currentNodeVersion.TrimStart('v')

    if ($requiredVersion -ne $currentVersion) {
        Write-Host "`nNode.js version mismatch: got $currentNodeVersion, need $requiredNodeVersion" -ForegroundColor Red
        Write-Host "Run: nvm use" -ForegroundColor Yellow
        exit 1
    }
}

if ($null -eq $node) {
    Write-Host "`nNodeJS doesn't appear to be installed or is not on your Path." -ForegroundColor White
    return
}

Write-Host "`nInstalling root-level dependencies..." -ForegroundColor White
npm install

Write-Host "`nBuilding packages..." -ForegroundColor White
node ./scripts/build-packages.js

Write-Host "`nInstalling Core dependencies..." -ForegroundColor White
Push-Location core
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
npm install --ignore-scripts
Pop-Location
node ./scripts/build/install-core-native-deps.js
Push-Location core
npm run build
Pop-Location

Write-Host "`nInstalling GUI dependencies and building..." -ForegroundColor White
Push-Location gui
npm install
npm run build
Pop-Location

Write-Host "`nPreparing IntelliJ plugin resources..." -ForegroundColor White
node ./scripts/build/prepare-intellij.js

Write-Host "`nInstalling binary dependencies..." -ForegroundColor White
Push-Location binary
npm install
npm run build
Pop-Location

Write-Host "`nInstalling CLI dependencies..." -ForegroundColor White
Push-Location extensions/cli
npm install
Pop-Location

Write-Host "`nDone." -ForegroundColor Green
