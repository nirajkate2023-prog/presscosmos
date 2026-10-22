# PressCosmos - build a clean, Hostinger-ready deployment package.
#
# Produces:
#   build/hostinger/           the exact file set to upload to public_html
#   presscosmos-hostinger.zip  the same thing zipped, for File Manager upload
#
# Only site files are copied. Build tooling, docs and git metadata are excluded,
# so nothing internal is ever exposed on the web server.
#
# Run: powershell -ExecutionPolicy Bypass -File tools/make-deploy.ps1

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$staging = Join-Path $root 'build\hostinger'
$zipPath = Join-Path $root 'presscosmos-hostinger.zip'

Write-Output 'PressCosmos - preparing Hostinger deployment package'
Write-Output "  source : $root"
Write-Output "  output : $staging"
Write-Output ''

# ---------------------------------------------------------------- build first
Write-Output 'Regenerating the site...'
& node (Join-Path $PSScriptRoot 'build.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Site build failed. Deployment package not created.' }

# ------------------------------------------------------------------- staging
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Force -Path $staging | Out-Null

# Every generated page sits at the site root.
Get-ChildItem -Path $root -Filter '*.html' -File | ForEach-Object {
  Copy-Item $_.FullName -Destination $staging
}

# Assets and icons.
Copy-Item (Join-Path $root 'assets') -Destination $staging -Recurse
foreach ($file in @('favicon.svg', 'favicon-32.png', 'apple-touch-icon.png')) {
  Copy-Item (Join-Path $root $file) -Destination $staging
}

# Machine-readable layer.
foreach ($file in @('robots.txt', 'sitemap.xml', 'llms.txt', 'rss.xml', 'manifest.webmanifest')) {
  Copy-Item (Join-Path $root $file) -Destination $staging
}

# Server configuration.
Copy-Item (Join-Path $root '.htaccess') -Destination $staging

# Upload instructions, included in the package only (not in the repository).
$instructions = @'
PressCosmos - Hostinger deployment package
=========================================

WHAT THIS IS
  The complete static site. No build step, no database, no Node.js, no PHP.

HOW TO DEPLOY
  Option A - hPanel File Manager
    1. Log in to Hostinger hPanel and open File Manager for your domain.
    2. Open the public_html folder.
    3. Delete the default placeholder files Hostinger creates (default.php,
       index.php or similar) so they do not shadow index.html.
    4. Upload presscosmos-hostinger.zip into public_html.
    5. Right-click the zip and choose Extract. This extracts in place, so the
       site root ends up directly inside public_html.
    6. Delete the zip afterwards.
    7. Confirm .htaccess was extracted. File Manager may hide dotfiles - enable
       "Show hidden files" in its settings.

  Option B - FTP / SFTP (FileZilla or similar)
    1. Get the FTP credentials from hPanel > Files > FTP Accounts.
    2. Connect and open public_html.
    3. Upload the CONTENTS of this folder (not the folder itself). The result
       must be public_html/index.html, not public_html/hostinger/index.html.
    4. Make sure .htaccess uploads too - most clients skip dotfiles unless you
       enable "Show hidden files" / allow the transfer.

  Option C - Git deployment
    See DEPLOY.md in the repository. Point hPanel > Advanced > GIT at
    your repository, branch main. The .htaccess in this package already blocks
    web access to /tools/, /README.md, /.git and other non-site files, so a
    full-repo checkout is safe.

AFTER UPLOADING
  1. Enable SSL (hPanel > Security > SSL) and wait for it to become active.
  2. The .htaccess forces https:// and redirects www to the bare domain. If you
     see an SSL error immediately after uploading, SSL is not active yet -
     comment out the two redirect lines at the top of .htaccess (section 3) to
     let the site serve over http until the certificate is issued.
  3. Visit https://yourdomain.com and confirm the home page loads.
  4. Check https://yourdomain.com/404.html rendering by visiting a URL that does
     not exist, such as /nope.

DOSSIER
  index.html ................. home page
  assets/css/main.css ........ all styles
  assets/js/app.js ........... all interactions and animation
  assets/img/ ................ social card and icons
  robots.txt, sitemap.xml .... crawler files
  llms.txt ................... guidance file for AI assistants
  rss.xml .................... press release feed
  404.html ................... styled not-found page
  .htaccess .................. HTTPS, headers, compression, caching, protection

TROUBLESHOOTING
  Blank page ................. confirm index.html is directly in public_html
  Styles missing ............. confirm assets/ uploaded with the same structure
  500 error .................. a server module is unavailable; the .htaccess is
                               wrapped in <IfModule> guards, so re-check that the
                               file uploaded completely and was not truncated
  www works but bare does not  check the A record for @ in DNS
'@
Set-Content -Path (Join-Path $staging 'UPLOAD-INSTRUCTIONS.txt') -Value $instructions -Encoding ASCII

# ---------------------------------------------------------------------- zip
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zipPath -CompressionLevel Optimal

# ------------------------------------------------------------------- report
$files = Get-ChildItem $staging -Recurse -File
$totalKb = [math]::Round(($files | Measure-Object Length -Sum).Sum / 1KB, 1)
$zipKb = [math]::Round((Get-Item $zipPath).Length / 1KB, 1)

Write-Output ''
Write-Output 'Deployment package ready'
Write-Output "  files staged : $($files.Count)"
Write-Output "  uncompressed : $totalKb KB"
Write-Output "  zip          : $zipPath ($zipKb KB)"
Write-Output ''
Write-Output 'Breakdown:'
$files | Group-Object { $_.Extension.ToLower() } |
  Sort-Object Count -Descending |
  Select-Object @{n = 'Type'; e = { if ($_.Name) { $_.Name } else { '(none)' } } }, Count, @{n = 'KB'; e = { [math]::Round((($_.Group | Measure-Object Length -Sum).Sum) / 1KB, 1) } } |
  Format-Table -AutoSize

Write-Output 'Verify that .htaccess and index.html are in the package:'
foreach ($required in @('.htaccess', 'index.html', '404.html', 'llms.txt', 'UPLOAD-INSTRUCTIONS.txt')) {
  $present = Test-Path (Join-Path $staging $required)
  Write-Output ("  {0,-24} {1}" -f $required, $(if ($present) { 'present' } else { 'MISSING' }))
}
