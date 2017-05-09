#!/bin/bash
yarn install

cd ./android
./gradlew assembleRelease

cp app/build/outputs/apk/app-release.apk ~/loewelDrive/drive2Phone/sites.apk
insync force_sync ~/loewelDrive/drive2Phone/sites.apk

cp app/build/outputs/apk/app-release.apk ~/loewelDrive/proj/obob/sitesApp
insync force_sync ~/loewelDrive/proj/obob/sitesApp/sites.apk
cd ..
yarn run slack -- -t "${SLACK_TOKEN:?Need to set evn variable SLACK_TOKEN get one here: https://api.slack.com/docs/oauth-test-tokens}" -h operations -u ReleaseScript -m "New release can be found at: https://drive.google.com/open?id=0B4a1L39CG_LwV2x5OEJvQXh5dFU"
