#!/bin/bash
yarn install

cd ./android
./gradlew assembleRelease

cp app/build/outputs/apk/app-release.apk ~/loewelDrive/drive2Phone/sites.apk
insync force_sync ~/loewelDrive/drive2Phone/sites.apk

cp app/build/outputs/apk/app-release.apk ~/loewelDrive/proj/obob/sitesApp
insync force_sync ~/loewelDrive/proj/obob/sitesApp/sites.apk
