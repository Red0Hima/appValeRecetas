param(
  [ValidateSet('debug', 'release')]
  [string]$BuildType = 'release'
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$apkPath = if ($BuildType -eq 'release') {
  Join-Path $projectRoot 'android\app\build\outputs\apk\release\app-release.apk'
} else {
  Join-Path $projectRoot 'android\app\build\outputs\apk\debug\app-debug.apk'
}
if (-not (Test-Path $apkPath)) {
  $buildCommand = if ($BuildType -eq 'release') { 'npm run apk:release' } else { 'npm run apk:debug' }
  Write-Error "No existe APK ${BuildType}: $apkPath. Ejecuta primero: $buildCommand"
}

$adbCmd = Get-Command adb -ErrorAction SilentlyContinue
if ($adbCmd) {
  $adb = $adbCmd.Source
} else {
  $adbCandidate = Join-Path $env:LOCALAPPDATA 'Android\Sdk\platform-tools\adb.exe'
  if (Test-Path $adbCandidate) {
    $adb = $adbCandidate
  } else {
    Write-Error 'No se encontro adb. Agrega platform-tools al PATH o instala Android SDK Platform-Tools.'
  }
}

$devicesOutput = & $adb devices
$authorizedDevice = $devicesOutput |
  Where-Object { $_ -match '^\S+\s+device(\s|$)' } |
  Select-Object -First 1

if (-not $authorizedDevice) {
  Write-Error 'No hay dispositivo Android autorizado por adb. Activa Depuracion USB y acepta el dialogo RSA.'
}

& $adb install -r $apkPath
Write-Host "APK $BuildType instalada: $apkPath"
