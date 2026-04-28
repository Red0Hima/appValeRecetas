# Universal Converter (ffmpeg + Tkinter)

Aplicacion de escritorio para convertir multiples archivos entre formatos con una interfaz simple:

- Selector de archivos (sin limite fijo de cantidad)
- Selector de carpeta de destino
- Lista de archivos seleccionados con nombre de salida editable
- Selector de formato de salida por cada archivo (por ejemplo `mp3`, `wav`, `ogg`, `mp4`, etc.)
- Boton para convertir todos los archivos
- Barra de progreso del archivo actual
- Barra de progreso total de la cola de conversion

## Requisitos

- Python 3.10 o superior
- `ffmpeg` instalado y disponible en `PATH`

### Verificar ffmpeg en Windows

```powershell
ffmpeg -version
```

Si el comando no existe, instala ffmpeg y agrega su carpeta `bin` al `PATH` del sistema.

## Ejecutar

```powershell
python app.py
```

## Crear .exe (PyInstaller)

1. Instala PyInstaller:

```powershell
python -m pip install pyinstaller
```

2. Genera el ejecutable:

```powershell
python -m PyInstaller --noconfirm --clean --onefile --windowed --name UniversalConverter app.py
```

3. El ejecutable final queda en:

```text
dist\UniversalConverter.exe
```

## Uso

1. Clic en **Select files** y elige uno o varios archivos.
2. Clic en **Choose folder** para seleccionar la carpeta de salida.
3. Edita los nombres en la columna **Output name** si quieres renombrarlos antes de convertir.
4. Elige la extension destino para cada fila en **Output format**.
5. Clic en **Convert files**.

## Notas

- Si dos archivos quedan con el mismo nombre y extension de salida, la app agrega sufijos automaticamente (`_2`, `_3`, etc.).
- Si un nombre contiene caracteres invalidos para Windows, se reemplazan por `_`.
- La conversion depende de las capacidades de `ffmpeg`: no todas las combinaciones de entrada/salida son compatibles.
