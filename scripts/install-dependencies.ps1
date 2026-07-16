# Install dependencies for the JetBrains / IntelliJ Continue plugin stack.

Write-Host "`nChecking for dependencies that may require manual installation...`n" -ForegroundColor White

$node  = (get-command node -ErrorAction SilentlyContinue)
if ($null -eq $node) {
    Write-Host "Not Found " -ForegroundColor Red -NoNewLine
    Write-Host "node"
} else {
    Write-Host "Found " -ForegroundColor Green -NoNewLine
    Write-Host "node "  -NoNewLine
    & node --version
}

# Node.js version check
if (Test-Path ".nvmrc") {
    $requiredNodeVersion = Get-Content ".nvmrc"
    $currentNodeVersion = node -v

    # Remove 'v' prefix from versions for comparison
    $requiredVersion = $requiredNodeVersion.TrimStart('v')
    $currentVersion = $currentNodeVersion.TrimStart('v')

    if ($requiredVersion -ne $currentVersion) {
        Write-Host "`n⚠️  Warning: Your Node.js version ($currentNodeVersion) does not match the required version ($requiredNodeVersion)" -ForegroundColor Yellow
        Write-Host "Please consider switching to the correct version using: nvm use" -ForegroundColor Yellow
        
        # Check if running in interactive mode
        if ([Environment]::UserInteractive -and [Environment]::GetCommandLineArgs().Count -eq 0) {
            Write-Host "Press Enter to continue with installation anyway..." -NoNewline -ForegroundColor Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            Write-Host "`n" # Add newline after key press
        } else {
            Write-Host "Continuing with installation anyway...`n" -ForegroundColor Yellow
        }
    }
}

if ($null -eq $node) {
    Write-Host "`n...`n"
    Write-Host "NodeJS`n" -ForegroundColor White
    Write-Host "Doesn't appear to be installed or is not on your Path."
    Write-Host "On most Windows systems you can install node using: " -NoNewLine
    Write-Host "winget install OpenJS.NodeJS.LTS " -ForegroundColor Green
    Write-Host "After installing restart your Terminal to update your Path."
    Write-Host "Alternatively see: " -NoNewLine
    Write-Host "https://nodejs.org/" -ForegroundColor Yellow
    return "`nSome dependencies that may require installation could not be found. Exiting"
}

Write-Host "`nInstalling root-level dependencies..." -ForegroundColor White
npm install

Write-Host "`nBuilding packages (fetch, openai-adapters, config-yaml)..." -ForegroundColor White
node ./scripts/build-packages.js

Write-Host "`nInstalling Core dependencies..." -ForegroundColor White
Push-Location core
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
npm install
npm link
Pop-Location

Write-Output "`nInstalling GUI dependencies..." -ForegroundColor White
Push-Location gui
npm install
npm link @continuedev/core
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm run build
Pop-Location

Write-Output "`nCopying GUI build into IntelliJ webview..." -ForegroundColor White
node ./scripts/copy-gui-to-intellij.js

Write-Output "`nInstalling binary dependencies..." -ForegroundColor White
Push-Location binary
npm install
npm run build
Pop-Location

Write-Output "`nDone. Open extensions/intellij in IntelliJ and run the 'Run Continue' configuration." -ForegroundColor Green
