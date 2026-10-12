<#
  Start a new client website from a vault template.

  Usage (from the template-vault folder):
    powershell -ExecutionPolicy Bypass -File .\new-site.ps1 -Template aurora -Client sunrise-bakery
    powershell -ExecutionPolicy Bypass -File .\new-site.ps1 -List

  Creates clients\<Client>\ containing the template plus its own copy of the
  animation kit (assets\motion.css, assets\motion.js), so the client site is
  fully standalone: zip it, upload it, or put it in its own git repo.

  Optional (the vault's Customize panel fills these in for you):
    -Theme "--bg:#ffffff;--accent:#e07a5f"   colour overrides appended to style.css
    -Fonts "Fraunces|Inter"                   display|body Google Fonts
    -FontVars "--serif|--font"                which CSS variables take those fonts
#>
param(
  [string]$Template,
  [string]$Client,
  [string]$Dest,
  [string]$Theme,
  [string]$Fonts,
  [string]$FontVars,
  [switch]$List,
  [switch]$Open
)

$ErrorActionPreference = 'Stop'
$vault = $PSScriptRoot
$templatesDir = Join-Path $vault 'templates'

$available = Get-ChildItem $templatesDir -Directory | Where-Object { $_.Name -notlike '_*' } | Select-Object -ExpandProperty Name

if ($List -or -not $Template) {
  Write-Host "`nTemplates in the vault:" -ForegroundColor Yellow
  $available | ForEach-Object { Write-Host "  - $_" }
  Write-Host "`nExample: .\new-site.ps1 -Template aurora -Client sunrise-bakery`n"
  return
}

if ($available -notcontains $Template) {
  throw "No template called '$Template'. Run with -List to see the options."
}
if (-not $Client) { throw "Give the client a name, e.g. -Client sunrise-bakery" }

# Folder-safe client name
$plain = $Client.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', ''
$slug = ($plain.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
if (-not $slug) { throw "Client name '$Client' has no usable letters or numbers." }

if (-not $Dest) { $Dest = Join-Path $vault 'clients' }
$target = Join-Path $Dest $slug
if (Test-Path $target) { throw "$target already exists. Pick another client name, or delete that folder first." }

# Copy template + animation kit
New-Item -ItemType Directory -Force $target | Out-Null
Copy-Item (Join-Path $templatesDir "$Template\*") $target -Recurse
$assets = Join-Path $target 'assets'
New-Item -ItemType Directory -Force $assets | Out-Null
Copy-Item (Join-Path $templatesDir '_shared\*') $assets -Recurse -Exclude 'vault-bridge.js'

# Fonts chosen in the vault customiser (validated: plain family names only)
$fontLink = ''
$fontCss = ''
if ($Fonts) {
  $fams = @($Fonts.Split('|') | Where-Object { $_ -match '^[A-Za-z0-9 ]{1,40}$' })
  $vars = @(if ($FontVars) { $FontVars.Split('|') } else { @('--display', '--font') })
  if ($fams.Count) {
    $query = ($fams | Select-Object -Unique | ForEach-Object { 'family=' + $_.Replace(' ', '+') + ':wght@400;500;600;700;800' }) -join '&'
    $fontLink = "  <link href=`"https://fonts.googleapis.com/css2?$query&display=swap`" rel=`"stylesheet`">`n"
    for ($i = 0; $i -lt [Math]::Min($fams.Count, $vars.Count); $i++) {
      if ($vars[$i] -match '^--[a-z0-9-]+$') { $fontCss += "  $($vars[$i]): '$($fams[$i])', sans-serif;`n" }
    }
  }
}

# Point the pages at the local kit, drop the vault-only bridge, add fonts (UTF-8 safe, no BOM)
$utf8 = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem $target -Filter *.html -Recurse | ForEach-Object {
  $html = [IO.File]::ReadAllText($_.FullName, $utf8)
  $html = $html -replace '[ \t]*<script src="\.\./_shared/vault-bridge\.js"></script>\r?\n?', ''
  $html = $html.Replace('../_shared/', 'assets/')
  if ($fontLink) { $html = $html.Replace('</head>', $fontLink + '</head>') }
  [IO.File]::WriteAllText($_.FullName, $html, $utf8)
}

# Colours chosen in the vault customiser, appended as an override block
$themeCss = ''
if ($Theme) {
  foreach ($pair in $Theme.Split(';')) {
    $k, $v = $pair.Split(':', 2)
    if ($k -and $v -and $k.Trim() -match '^--[a-z0-9-]+$' -and $v.Trim() -match '^#[0-9a-fA-F]{3,8}$') { $themeCss += "  $($k.Trim()): $($v.Trim());`n" }
  }
}
if ($themeCss -or $fontCss) {
  $css = Join-Path $target 'style.css'
  $block = "`n/* Brand overrides from the Template Vault customiser */`n:root, body, body[data-color] {`n$themeCss$fontCss}`n"
  [IO.File]::AppendAllText($css, $block, $utf8)
}

# Small project note so you remember where it came from
$note = @"
# $Client

Started from the **$Template** template on $(Get-Date -Format 'yyyy-MM-dd').

- Open ``index.html`` in a browser to view.
- Colours and fonts: edit the ``:root`` tokens at the top of ``style.css``.
- Animations: ``assets/motion.js`` + ``assets/motion.css`` (see animations.html in the vault).
- Photo placeholders (``.ph`` and similar classes) are CSS gradients. Swap them for real images.
"@
[IO.File]::WriteAllText((Join-Path $target 'PROJECT.md'), $note, $utf8)

Write-Host "`nCreated $target" -ForegroundColor Green
Write-Host "  Template : $Template"
if ($themeCss -or $fontCss) { Write-Host "  Brand    : custom colours/fonts applied (end of style.css)" }
Write-Host "  Open     : $(Join-Path $target 'index.html')`n"

if ($Open) { Start-Process (Join-Path $target 'index.html') }
