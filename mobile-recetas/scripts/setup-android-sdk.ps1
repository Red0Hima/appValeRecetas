$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $projectRoot 'android'
$localPropsPath = Join-Path $androidDir 'local.properties'

$candidates = @()
if ($env:ANDROID_HOME) { $candidates += $env:ANDROID_HOME }
if ($env:ANDROID_SDK_ROOT) { $candidates += $env:ANDROID_SDK_ROOT }
$candidates += (Join-Path $env:LOCALAPPDATA 'Android\Sdk')

$sdkPath = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $sdkPath) {
  Write-Error 'No se encontro Android SDK. Instala Android Studio y SDK Platform 36.'
}

$escaped = $sdkPath -replace '\\', '\\\\'
"sdk.dir=$escaped" | Set-Content -Path $localPropsPath -Encoding ascii
Write-Host "SDK configurado en: $sdkPath"
Write-Host "Archivo generado: $localPropsPath"
