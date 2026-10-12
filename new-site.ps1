<#
  Start a new client website from a vault template.

  Usage (from the template-vault folder):
    powershell -ExecutionPolicy Bypass -File .\new-site.ps1 -Template aurora -Client sunrise-bakery
    powershell -ExecutionPolicy Bypass -File .\new-site.ps1 -List

  Creates clients\<Client>\ containing the template plus its own copy of the
  animation kit (assets\motion.css, assets\motion.js), so the client site is
  fully standalone: zip it, upload it, or put it in its own git repo.
#>
param(
  [string]$Template,
  [string]$Client,
  [string]$Dest,
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
Copy-Item (Join-Path $templatesDir '_shared\*') $assets -Recurse

# Point the pages at the local kit (UTF-8 safe, no BOM)
$utf8 = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem $target -Filter *.html -Recurse | ForEach-Object {
  $html = [IO.File]::ReadAllText($_.FullName, $utf8)
  $html = $html.Replace('../_shared/', 'assets/')
  [IO.File]::WriteAllText($_.FullName, $html, $utf8)
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
Write-Host "  Open     : $(Join-Path $target 'index.html')`n"

if ($Open) { Start-Process (Join-Path $target 'index.html') }
