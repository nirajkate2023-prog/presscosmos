# Raster asset generator for PressCosmos.
# Draws the social card and the PNG favicons with System.Drawing so every
# image in the repo is generated from source rather than downloaded.
# Run: powershell -ExecutionPolicy Bypass -File tools/gen-assets.ps1

Add-Type -AssemblyName System.Drawing

$root = Join-Path $PSScriptRoot '..'
$imgDir = Join-Path $root 'assets\img'
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Force -Path $imgDir | Out-Null }

function New-FontObj($size, $style, $family) {
  $fs = [System.Drawing.FontStyle]::$style
  return New-Object System.Drawing.Font($family, $size, $fs, [System.Drawing.GraphicsUnit]::Pixel)
}

function New-GradientBrush($rect, $hexA, $hexB, $angle) {
  $c1 = [System.Drawing.ColorTranslator]::FromHtml($hexA)
  $c2 = [System.Drawing.ColorTranslator]::FromHtml($hexB)
  return New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, $angle)
}

function Add-Glow($gfx, $cx, $cy, $radius, $hex, $alpha) {
  $steps = 26
  for ($i = $steps; $i -ge 1; $i--) {
    $r = [int]($radius * ($i / $steps))
    $a = [int]($alpha * (1 - ($i / $steps)))
    $col = [System.Drawing.ColorTranslator]::FromHtml($hex)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($a, $col.R, $col.G, $col.B))
    $gfx.FillEllipse($brush, ($cx - $r), ($cy - $r), ($r * 2), ($r * 2))
    $brush.Dispose()
  }
}

# ---------------------------------------------------------------- social card
function New-SocialCard($path) {
  $w = 1200; $h = 630
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $bg = New-GradientBrush $rect '#05060F' '#141A3A' 20
  $g.FillRectangle($bg, $rect)

  Add-Glow $g 220 120 420 '#7C5CFF' 90
  Add-Glow $g 1020 520 380 '#22D3EE' 70
  Add-Glow $g 760 90 300 '#F472B6' 50

  # orbit rings
  $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 255, 255, 255), 2)
  $ringPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
  $g.DrawEllipse($ringPen, 880, 70, 420, 420)
  $ringPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 34, 211, 238), 2)
  $g.DrawEllipse($ringPen2, 960, 150, 260, 260)
  $planet = New-GradientBrush (New-Object System.Drawing.Rectangle(1030, 220, 120, 120)) '#7C5CFF' '#22D3EE' 45
  $g.FillEllipse($planet, 1030, 220, 120, 120)

  # wordmark
  $brandFont = New-FontObj 78 'Bold' 'Segoe UI'
  $g.DrawString('PressCosmos', $brandFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), 64, 120)

  # accent underline
  $lineBrush = New-GradientBrush (New-Object System.Drawing.Rectangle(64, 226, 520, 8)) '#7C5CFF' '#22D3EE' 0
  $g.FillRectangle($lineBrush, 64, 226, 520, 8)

  # headline
  $hlFont = New-FontObj 52 'Bold' 'Segoe UI'
  $hlBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#EEF0FF'))
  $g.DrawString("Get published, picked up", $hlFont, $hlBrush, 64, 286)
  $g.DrawString("and cited by AI.", $hlFont, $hlBrush, 64, 350)

  # supporting line
  $subFont = New-FontObj 28 'Regular' 'Segoe UI'
  $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#A2A8C8'))
  $g.DrawString("Press release distribution | AI visibility | Media monitoring", $subFont, $subBrush, 66, 440)

  # stats row
  $statFont = New-FontObj 34 'Bold' 'Segoe UI'
  $statBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#22D3EE'))
  $labelFont = New-FontObj 20 'Regular' 'Segoe UI'
  $labelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#6F7699'))
  $stats = @(@('2,400+', 'media destinations'), @('68', 'countries'), @('42 min', 'median publish'))
  $x = 66
  foreach ($s in $stats) {
    $g.DrawString($s[0], $statFont, $statBrush, $x, 502)
    $g.DrawString($s[1], $labelFont, $labelBrush, $x, 546)
    $x += 250
  }

  $g.DrawString('presscosmos.com', $labelFont, $labelBrush, 66, 592)

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "wrote $path"
}

# ------------------------------------------------------------------- favicons
function New-Mark($size, $path, $rounded) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  if ($rounded) {
    $bg = New-GradientBrush $rect '#06081A' '#141A3A' 45
    $g.FillEllipse($bg, 0, 0, $size, $size)
  }

  Add-Glow $g ($size / 2) ($size / 2) ($size * 0.5) '#7C5CFF' 120

  $cx = $size / 2; $cy = $size / 2
  $rx = $size * 0.42; $ry = $size * 0.17
  $ring = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 124, 92, 255), [Math]::Max(1.2, $size * 0.035))
  for ($rot = 0; $rot -lt 180; $rot += 60) {
    $g.TranslateTransform($cx, $cy)
    $g.RotateTransform($rot)
    $g.DrawEllipse($ring, (-$rx), (-$ry), ($rx * 2), ($ry * 2))
    $g.ResetTransform()
  }

  $core = New-GradientBrush (New-Object System.Drawing.Rectangle(($cx - $size * 0.18), ($cy - $size * 0.18), ($size * 0.36), ($size * 0.36))) '#7C5CFF' '#F472B6' 45
  $g.FillEllipse($core, ($cx - $size * 0.18), ($cy - $size * 0.18), ($size * 0.36), ($size * 0.36))

  $sat = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#22D3EE'))
  $g.FillEllipse($sat, ($cx + $rx - $size * 0.05), ($cy - $size * 0.05), ($size * 0.1), ($size * 0.1))

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "wrote $path"
}

New-SocialCard (Join-Path $imgDir 'og-image.png')
New-Mark 512 (Join-Path $imgDir 'favicon-512.png') $true
New-Mark 192 (Join-Path $imgDir 'favicon-192.png') $true
New-Mark 180 (Join-Path $root 'apple-touch-icon.png') $true
New-Mark 32 (Join-Path $root 'favicon-32.png') $false

Write-Output 'asset generation complete'
