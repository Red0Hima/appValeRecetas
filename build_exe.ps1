$ErrorActionPreference = "Stop"

Write-Host "Installing/updating PyInstaller..."
python -m pip install --upgrade pyinstaller

Write-Host "Building UniversalConverter.exe..."
python -m PyInstaller --noconfirm --clean --onefile --windowed --name UniversalConverter app.py

Write-Host "Done. Executable available at dist\\UniversalConverter.exe"
