# App movil ultra sencilla de recetas

Proyecto en Expo + React Native con una sola pantalla:

- Buscador por nombre
- Filtro por categoria
- Tarjetas de recetas
- Modal con ingredientes y pasos

## Requisitos

- Node.js 20 o 22 (LTS recomendado)
- Android Studio con Android SDK instalado
- Java 17 (normalmente lo instala Android Studio)
- Un telefono Android con Depuracion USB o un emulador Android

## Versiones objetivo

- Expo SDK: 55 (`expo@~55.0.6`)
- Expo Go: 55.0.6

## Desarrollo con Expo Go

1. Instala dependencias:

npm install

2. Inicia servidor Expo:

npm start

3. Abre en Expo Go por QR o URL.

## Build APK local (nativo Android)

1. Generar/actualizar proyecto Android nativo:

npm run prebuild:android

2. Configurar ruta de Android SDK para Gradle:

npm run android:sdk:setup

3. Compilar APK release:

npm run apk:release

4. APK resultante:

android/app/build/outputs/apk/release/app-release.apk

5. Instalar en telefono (con Depuracion USB activa):

npm run apk:install

## Scripts utiles

- `npm run android`: ejecuta la app nativa en Android (requiere emulador/dispositivo)
- `npm run apk:release`: compila APK release local
- `npm run apk:install:release`: instala APK release
- `npm run apk:install:debug`: instala APK debug
- `npm run start:tunnel`: servidor Expo con tunel

## Estructura

- App.js: pantalla principal y estilos
- app.json: configuracion Expo
- package.json: scripts y dependencias
- android/: proyecto Android nativo generado por Expo prebuild
