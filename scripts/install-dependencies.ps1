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
        Write-Host "`n⚠️  Warning: Your Node.js version ($currentNodeVersion) does not match the required version ($requiredNodeVersion)" -ForegroundColor Yellow
        Write-Host "Please consider switching to the correct version using: nvm use" -ForegroundColor Yellow

        if ([Environment]::UserInteractive -and [Environment]::GetCommandLineArgs().Count -eq 0) {
            Write-Host "Press Enter to continue with installation anyway..." -NoNewline -ForegroundColor Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            Write-Host "`n"
        } else {
            Write-Host "Continuing with installation anyway...`n" -ForegroundColor Yellow
        }
    }
}

if ($null -eq $node) {
    Write-Host "`nNodeJS doesn't appear to be installed or is not on your Path." -ForegroundColor White
    return
}

Write-Host "`nInstalling root-level dependencies..." -ForegroundColor White
npm install

$env:npm_config_sharp_libvips_binary_host = if ($env:npm_config_sharp_libvips_binary_host) { $env:npm_config_sharp_libvips_binary_host } else { "https://npmmirror.com/mirrors/sharp-libvips" }
$env:npm_config_sharp_binary_host = if ($env:npm_config_sharp_binary_host) { $env:npm_config_sharp_binary_host } else { "https://npmmirror.com/mirrors/sharp" }

Write-Host "`nBuilding packages..." -ForegroundColor White
node ./scripts/build-packages.js

Write-Host "`nInstalling Core dependencies..." -ForegroundColor White
Push-Location core
npm install
npm link
npm run build
Pop-Location

Write-Host "`nInstalling GUI dependencies and building..." -ForegroundColor White
Push-Location gui
npm install
npm link @continuedev/core
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
